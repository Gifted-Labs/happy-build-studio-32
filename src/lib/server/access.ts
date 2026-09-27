/**
 * Cloudflare Access verification for the admin area.
 *
 * Access gates `/admin` at the edge, but the Worker verifies the assertion again
 * rather than trusting that it was gated. Edge protection is bound to a hostname
 * and path; a Worker can be reachable by more than one (workers.dev, a preview
 * URL, a route added later), and only one of those needs to fall outside the
 * Access policy for an unverified request to arrive here. The admin area exposes
 * names, email addresses, and messages sent by people who contacted the
 * foundation, so the second check is worth its cost.
 *
 * This fails CLOSED. If the Access variables are absent, every request is denied
 * rather than waved through — a deployment that forgets to configure Access ends
 * up with an unreachable admin page, not an open one.
 */
import { bindings, isDev } from "./env";

const JWT_HEADER = "cf-access-jwt-assertion";
const JWT_COOKIE = "CF_Authorization";

/** JWKS rarely changes; refetching per request would add a round trip to every load. */
const JWKS_TTL_MS = 60 * 60 * 1000;
let jwksCache: { keys: Map<string, CryptoKey>; fetchedAt: number; team: string } | undefined;

export class AccessDenied extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AccessDenied";
  }
}

type AccessClaims = {
  aud?: string | string[];
  iss?: string;
  exp?: number;
  nbf?: number;
  email?: string;
};

function base64UrlToBytes(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/**
 * A segment that will not decode is a malformed token, which is a denial — not
 * an unexpected failure. Letting the parse error escape turned a garbage
 * `cf-access-jwt-assertion` header into a 500 instead of a clean rejection.
 */
function decodeJson<T>(segment: string): T {
  try {
    return JSON.parse(new TextDecoder().decode(base64UrlToBytes(segment))) as T;
  } catch {
    throw new AccessDenied("Access assertion could not be decoded.");
  }
}

/** `https://<team>.cloudflareaccess.com`, normalised from whatever form is configured. */
function teamDomain(): string {
  const raw = (bindings.CF_ACCESS_TEAM_DOMAIN ?? "").trim().replace(/\/+$/, "");
  if (!raw) return "";
  const host = raw.replace(/^https?:\/\//, "");
  return `https://${host.includes(".") ? host : `${host}.cloudflareaccess.com`}`;
}

async function signingKeys(): Promise<Map<string, CryptoKey>> {
  const team = teamDomain();
  const fresh =
    jwksCache && jwksCache.team === team && Date.now() - jwksCache.fetchedAt < JWKS_TTL_MS;
  if (fresh) return jwksCache!.keys;

  const response = await fetch(`${team}/cdn-cgi/access/certs`, {
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new AccessDenied(`Could not fetch Access keys (${response.status})`);

  const { keys = [] } = (await response.json()) as { keys?: Array<JsonWebKey & { kid?: string }> };
  const imported = new Map<string, CryptoKey>();
  for (const key of keys) {
    if (!key.kid) continue;
    imported.set(
      key.kid,
      await crypto.subtle.importKey(
        "jwk",
        key,
        { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
        false,
        ["verify"],
      ),
    );
  }

  jwksCache = { keys: imported, fetchedAt: Date.now(), team };
  return imported;
}

function readToken(request: Request): string | undefined {
  const header = request.headers.get(JWT_HEADER);
  if (header) return header;

  const cookies = request.headers.get("cookie") ?? "";
  const match = cookies.match(new RegExp(`(?:^|;\\s*)${JWT_COOKIE}=([^;]+)`));
  return match?.[1];
}

/**
 * Resolve the signed-in administrator, or throw.
 *
 * @returns the verified email address on the assertion.
 */
export async function requireAdmin(request: Request): Promise<string> {
  // Local development has no Access in front of it; `vite dev` is not exposed.
  if (isDev && !bindings.CF_ACCESS_AUD) return "dev@localhost";

  const audience = bindings.CF_ACCESS_AUD?.trim();
  const team = teamDomain();
  if (!audience || !team) {
    throw new AccessDenied(
      "Cloudflare Access is not configured (CF_ACCESS_AUD / CF_ACCESS_TEAM_DOMAIN).",
    );
  }

  const token = readToken(request);
  if (!token) throw new AccessDenied("No Access assertion on the request.");

  const [headerSegment, payloadSegment, signatureSegment] = token.split(".");
  if (!headerSegment || !payloadSegment || !signatureSegment) {
    throw new AccessDenied("Malformed Access assertion.");
  }

  const { kid, alg } = decodeJson<{ kid?: string; alg?: string }>(headerSegment);
  if (alg !== "RS256" || !kid) throw new AccessDenied("Unexpected Access token algorithm.");

  const key = (await signingKeys()).get(kid);
  if (!key) throw new AccessDenied("Access token signed by an unknown key.");

  const signatureValid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    base64UrlToBytes(signatureSegment),
    new TextEncoder().encode(`${headerSegment}.${payloadSegment}`),
  );
  if (!signatureValid) throw new AccessDenied("Access token signature did not verify.");

  const claims = decodeJson<AccessClaims>(payloadSegment);
  const now = Math.floor(Date.now() / 1000);

  if (claims.iss !== team) throw new AccessDenied("Access token issued by another team.");
  if (typeof claims.exp === "number" && claims.exp < now) {
    throw new AccessDenied("Access token has expired.");
  }
  if (typeof claims.nbf === "number" && claims.nbf > now + 60) {
    throw new AccessDenied("Access token is not yet valid.");
  }

  const audiences = Array.isArray(claims.aud) ? claims.aud : claims.aud ? [claims.aud] : [];
  if (!audiences.includes(audience)) {
    throw new AccessDenied("Access token was issued for a different application.");
  }

  return claims.email ?? "unknown";
}

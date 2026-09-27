import { bindings, isDev } from "./env";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Cloudflare's documented always-passes test secret. Used in development so the
 * form flow is exercisable without real keys; never reachable in production,
 * where a missing secret throws instead.
 */
const TEST_SECRET = "1x0000000000000000000000000000000AA";

/**
 * Cloudflare's published test secrets, in every documented variant.
 *
 * These are recognised for one reason: a test secret validates dummy tokens that
 * no widget minted, so siteverify has no `action` to echo back and the action
 * check below cannot be satisfied. Detecting them explicitly keeps that leniency
 * confined to setups that are demonstrably using test keys — a real secret never
 * matches, so production is always strict.
 */
const TEST_SECRETS = new Set([
  "1x0000000000000000000000000000000AA", // always passes
  "2x0000000000000000000000000000000AA", // always fails
  "3x0000000000000000000000000000000AA", // always passes, token already spent
]);

/**
 * Hostnames accepted in development.
 *
 * `example.com` is there because that is the hostname Cloudflare's test keys
 * report back, regardless of where the widget was actually solved. It must never
 * reach the production allowlist — nor may `localhost`, which is why production
 * reads its hostnames from configuration instead of inheriting these.
 */
const DEV_HOSTNAMES = ["localhost", "127.0.0.1", "example.com"];

/** A token longer than this is not a Turnstile token; reject without a round-trip. */
const MAX_TOKEN_LENGTH = 2048;

const VERIFY_TIMEOUT_MS = 10_000;

type SiteVerifyResponse = {
  success: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

/**
 * Frontend hostnames this deployment will accept a solved challenge from.
 *
 * One widget is registered for several domains, so `success: true` alone only
 * proves the token came from *a* page using our site key — not from ours. Without
 * this check, a token solved on any other host registered to the widget would be
 * accepted here.
 */
function expectedHostnames(): Set<string> {
  const configured = (bindings.TURNSTILE_HOSTNAMES ?? "")
    .split(",")
    .map((hostname) => hostname.trim())
    .filter(Boolean);

  if (configured.length > 0) return new Set(configured);

  if (isDev) return new Set(DEV_HOSTNAMES);

  throw new Error("TURNSTILE_HOSTNAMES is not configured on this Worker.");
}

/**
 * Verify a Turnstile token before doing any work for a request.
 *
 * This runs first in every handler: it is what keeps automated submissions from
 * consuming the Resend free tier's 100 emails/day, which two emails per
 * submission would otherwise exhaust in well under an hour.
 *
 * Three things must hold, not just one:
 *   - `success` — the challenge was solved and the token has not been redeemed
 *     before (tokens are single-use; a replay fails here).
 *   - `action` — the token was minted by the widget on *this* form. Without it, a
 *     token from the newsletter box would be spendable against the contact form.
 *   - `hostname` — the challenge was solved on a host we serve.
 *
 * Anything unexpected fails closed: a network error, a non-2xx, or a body that
 * does not parse all return false rather than letting the submission through.
 */
export async function verifyTurnstile(
  token: string,
  expectedAction: string,
  remoteIp?: string,
): Promise<boolean> {
  const secret = bindings.TURNSTILE_SECRET_KEY ?? (isDev ? TEST_SECRET : undefined);

  if (!secret) {
    throw new Error("TURNSTILE_SECRET_KEY is not configured on this Worker.");
  }

  // Throws on missing production configuration — that is a deploy-time mistake,
  // not a failed challenge, and must not be mistaken for one.
  const allowedHostnames = expectedHostnames();

  if (typeof token !== "string" || token.length === 0 || token.length > MAX_TOKEN_LENGTH) {
    return false;
  }

  let result: SiteVerifyResponse;
  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
      body: new URLSearchParams({
        secret,
        response: token,
        ...(remoteIp ? { remoteip: remoteIp } : {}),
      }),
    });

    if (!response.ok) throw new Error(`siteverify ${response.status}`);
    result = (await response.json()) as SiteVerifyResponse;
  } catch (error) {
    // A network failure reaching Cloudflare should not be a silent pass.
    console.error("[turnstile] verification error", error);
    return false;
  }

  if (!result.success) {
    console.warn("[turnstile] verification failed", result["error-codes"]);
    return false;
  }

  // A test secret cannot produce an action; anything else must match exactly.
  const usingTestSecret = TEST_SECRETS.has(secret);
  if (usingTestSecret && result.action === undefined) {
    console.warn("[turnstile] test secret in use — action check skipped, NOT for production");
  } else if (result.action !== expectedAction) {
    console.warn("[turnstile] action mismatch", { expected: expectedAction, got: result.action });
    return false;
  }

  if (!result.hostname || !allowedHostnames.has(result.hostname)) {
    console.warn("[turnstile] hostname not allowed", result.hostname);
    return false;
  }

  return true;
}

/**
 * Access to Cloudflare bindings and secrets from server-side code.
 *
 * `cloudflare:workers` resolves to the real runtime module in production and to
 * nitro's dev shim under `vite dev` (which reads `globalThis.__env__` / process
 * env), so this import is safe in both. Bindings themselves only exist when the
 * Worker is actually running with them configured — see `requireDb`.
 */
import { env } from "cloudflare:workers";

type Bindings = {
  /** D1 database holding form submissions and the site's editable content. */
  DB?: D1Database;
  /** R2 bucket holding every photograph; written to by the admin area. */
  MEDIA?: R2Bucket;
  /** Turnstile secret, from `wrangler secret put TURNSTILE_SECRET_KEY`. */
  TURNSTILE_SECRET_KEY?: string;
  /**
   * Comma-separated frontend hostnames a solved challenge may come from, e.g.
   * "lifestorycharitablefoundation.com,www.lifestorycharitablefoundation.com". Deployment-specific on purpose: the
   * production list must never contain localhost. See lib/server/turnstile.ts.
   */
  TURNSTILE_HOSTNAMES?: string;
  /** Resend API key, from `wrangler secret put RESEND_API_KEY`. */
  RESEND_API_KEY?: string;
  /** Verified Resend sender, e.g. "Life Story Foundation <hello@lifestory.org>". */
  RESEND_FROM?: string;
  /**
   * Cloudflare Access application audience (AUD) tag and team domain, used to
   * verify the admin area's Access assertion. Neither is a secret; both are
   * required, and their absence denies access rather than granting it. See
   * lib/server/access.ts.
   */
  CF_ACCESS_AUD?: string;
  CF_ACCESS_TEAM_DOMAIN?: string;
  /** Where submission notifications are delivered. */
  NOTIFY_EMAIL?: string;
};

export const bindings = env as unknown as Bindings;

/** True under `vite dev`, where bindings are typically absent. */
export const isDev = import.meta.env?.DEV === true;

/**
 * D1 handle, or null when the binding is missing.
 *
 * In development that is expected — `vite dev` has no D1 unless run through
 * wrangler — so callers log and carry on, keeping the form flow testable. In
 * production a missing binding is a misconfiguration and must be loud.
 */
export function getDb(): D1Database | null {
  const db = bindings.DB;
  if (db) return db;

  if (isDev) {
    console.warn(
      "[submissions] No D1 binding (DB). Submissions will not be persisted.\n" +
        "  This is expected under `vite dev`. To exercise the real path, run the\n" +
        "  built Worker with `wrangler dev` so bindings are available.",
    );
    return null;
  }

  throw new Error("D1 binding `DB` is not configured on this Worker.");
}

/**
 * R2 handle for photograph uploads, or null when the binding is missing.
 *
 * Unlike `getDb` this never throws: an upload is a single admin action, and a
 * missing binding should tell the person at the keyboard what is wrong rather
 * than surface as a 500 halfway through choosing a file.
 */
export function getMediaBucket(): R2Bucket | null {
  return bindings.MEDIA ?? null;
}

/**
 * Stand-in for `cloudflare:workers` during the prerender build pass.
 *
 * Pass 1 of `npm run build` runs with nitro off (see scripts/build.mjs), so the
 * Workers-only `cloudflare:workers` module has nothing to resolve it and the SSR
 * bundle fails to build. vite.config.ts aliases that specifier here for that pass
 * only; pass 2 builds against the real module.
 *
 * An empty env is safe because prerendering only renders static pages — it never
 * invokes the form handler, which is the sole reader of these bindings. Any code
 * path that does touch a binding still fails loudly rather than silently degrading,
 * because `getDb()` throws outside development when `DB` is absent.
 */
export const env = {};

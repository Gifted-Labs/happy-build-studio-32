// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { fileURLToPath } from "node:url";

import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { STATIC_PAGES, isDynamicPath } from "./src/lib/site-pages";

// Public origin, used for absolute URLs in the sitemap and social meta.
const SITE_URL = process.env.VITE_SITE_URL ?? "https://lifestorycharitablefoundation.com";

/**
 * `npm run build` runs vite twice — see scripts/build.mjs.
 *
 * Prerendering boots TanStack's preview server, which imports the built server
 * entry at `dist/server/server.js`. Nitro's cloudflare-module preset takes over
 * vite's server output and emits `index.mjs` instead, so the two cannot run in one
 * pass. The prerender pass therefore runs with nitro off to produce the static
 * HTML, and a second pass runs nitro to produce the deployable Worker.
 */
const PRERENDER_PASS = process.env.PRERENDER_PASS === "1";

export default defineConfig({
  // Off during the prerender pass so vite emits dist/server/server.js.
  nitro: PRERENDER_PASS
    ? false
    : {
        output: {
          dir: "dist",
          serverDir: "dist/server",
          publicDir: "dist/public",
        },
      },

  /**
   * `cloudflare:workers` (read by src/lib/server/env.ts for its bindings) has no
   * resolver during a vite build, so each pass needs it handled — differently:
   *
   *   - Pass 1 aliases it to a local stub. This pass's output is *executed by Node*
   *     to render the static HTML, so leaving the import unresolved would fail at
   *     module load. See the stub for why an empty env is safe there.
   *   - Pass 2 externalizes it. That output only ever runs on Workers, where the
   *     module is provided by the runtime, so the import must survive the bundle
   *     intact rather than be replaced by a stub.
   */
  vite: PRERENDER_PASS
    ? {
        resolve: {
          alias: {
            "cloudflare:workers": fileURLToPath(
              new URL("./src/lib/server/cloudflare-workers-shim.ts", import.meta.url),
            ),
          },
        },
      }
    : {
        build: { rolldownOptions: { external: ["cloudflare:workers"] } },
      },

  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },

    /**
     * Pages whose content lives in code are built to HTML at deploy time and
     * served as Workers static assets: free, unmetered, and exempt from the
     * Workers Free plan's 10 ms CPU limit per invocation.
     *
     * The CMS-driven pages (/projects, /projects/:slug, /news) are excluded —
     * see `filter`. They read D1 per request, which is the whole point of the
     * admin area: prerendering would freeze their content at deploy time.
     */
    prerender: {
      enabled: PRERENDER_PASS,
      // Follow <Link>s from the entry pages to discover the rest of the site.
      crawlLinks: true,
      // Fail the build rather than silently shipping a page that errored.
      failOnError: true,
      /**
       * Crawling picks up every in-page anchor and query variant it finds, which
       * render identical HTML to their canonical page. Skip them so they neither
       * get prerendered twice nor show up in the sitemap as duplicate URLs.
       */
      filter: (page: { path: string }) =>
        !page.path.includes("#") &&
        !page.path.includes("?") &&
        /**
         * Crawling the static pages reaches /projects and /news through the
         * navigation. They — and the admin area — read D1 per request, so their
         * HTML must never be written to a static asset: an asset would be served
         * ahead of the Worker and the site would show whatever the database held
         * on the day of the deploy, forever.
         */
        !isDynamicPath(page.path),
    },

    // Routes to start from, so a page stays covered even if nothing links to it.
    pages: STATIC_PAGES.map((path) => ({ path })),

    /**
     * The plugin writes a sitemap listing the pages it prerendered, which is no
     * longer the whole site — and a static file could not list an outreach added
     * after the deploy. src/lib/server/sitemap.ts builds it from D1 instead.
     */
    sitemap: {
      enabled: false,
      host: SITE_URL,
    },
  },
});

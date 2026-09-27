// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { fileURLToPath } from "node:url";

import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { projects } from "./src/data/projects";

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
     * Every page here is static content, so build them to HTML at deploy time.
     * Prerendered pages are served as Workers static assets: free, unmetered, and
     * exempt from the Workers Free plan's 10 ms CPU limit per invocation, which
     * server-rendering React on every request would risk exceeding.
     *
     * The Worker still runs for server functions (the form handlers), which stay
     * well inside that budget.
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
      filter: (page: { path: string }) => !page.path.includes("#") && !page.path.includes("?"),
    },

    // Routes to start from, including the dynamic project pages, so a route stays
    // covered even if nothing happens to link to it.
    pages: [
      { path: "/" },
      { path: "/about" },
      { path: "/projects" },
      { path: "/get-involved" },
      { path: "/news" },
      { path: "/donate" },
      { path: "/contact" },
      { path: "/faq" },
      ...projects.map((project) => ({ path: `/projects/${project.slug}` })),
    ],

    sitemap: {
      enabled: true,
      host: SITE_URL,
    },
  },
});

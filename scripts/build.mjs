/**
 * Two-pass production build.
 *
 * Pass 1 (PRERENDER_PASS=1, nitro off): vite builds the client and a Node-runnable
 * server entry, then TanStack's prerenderer boots that server and writes static
 * HTML for every route into dist/client.
 *
 * Pass 2 (nitro on): nitro builds the deployable Cloudflare Worker into
 * dist/server, with static assets in dist/public.
 *
 * The two cannot run together: nitro's cloudflare-module preset takes over vite's
 * server output and emits `index.mjs`, while the prerenderer's preview server
 * imports `dist/server/server.js`. So pass 1's finished static site is stashed and
 * copied over pass 2's asset directory afterwards.
 *
 * Copying pass 1's assets wholesale (not just the HTML) keeps the hashed asset
 * filenames referenced by the prerendered HTML consistent with what ships.
 */
import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const run = (env) =>
  execFileSync("npx", ["vite", "build", ...process.argv.slice(2)], {
    stdio: "inherit",
    env: { ...process.env, ...env },
  });

const step = (msg) => console.log(`\n\x1b[36m[build]\x1b[0m ${msg}`);

rmSync("dist", { recursive: true, force: true });

step("pass 1/2 — prerendering routes to static HTML");
run({ PRERENDER_PASS: "1" });

if (!existsSync("dist/client")) {
  throw new Error("Prerender pass produced no dist/client — aborting.");
}
const pages = readdirSync("dist/client", { recursive: true }).filter((f) =>
  String(f).endsWith(".html"),
);
if (pages.length === 0) {
  throw new Error("Prerender pass produced no HTML files — aborting.");
}
step(`prerendered ${pages.length} pages`);

const stash = mkdtempSync(join(tmpdir(), "lifestory-prerender-"));
cpSync("dist/client", stash, { recursive: true });

step("pass 2/2 — building Cloudflare Worker");
rmSync("dist", { recursive: true, force: true });
run({});

if (!existsSync("dist/public")) {
  throw new Error("Nitro pass produced no dist/public — aborting.");
}
step("merging prerendered pages into dist/public");
cpSync(stash, "dist/public", { recursive: true });
rmSync(stash, { recursive: true, force: true });

/**
 * Drop fragment, query, and private URLs from the sitemap.
 *
 * Link crawling records every `#anchor` and `?query` variant it encounters as a
 * discovered page. `prerender.filter` keeps them from being rendered twice but
 * does not feed the sitemap, which is built from the full crawl list — so they
 * would ship as duplicate URLs pointing at canonical pages.
 */
const sitemapPath = "dist/public/sitemap.xml";
if (existsSync(sitemapPath)) {
  const before = readFileSync(sitemapPath, "utf8");
  const after = before
    .replace(/\s*<url>(?:(?!<\/url>)[\s\S])*?<loc>[^<]*[#?][^<]*<\/loc>[\s\S]*?<\/url>/g, "")
    // `prerender.filter` keeps /admin from being rendered but does not feed the
    // sitemap, which is built from the full crawl list — so the admin area would
    // otherwise be advertised to search engines.
    .replace(/\s*<url>(?:(?!<\/url>)[\s\S])*?<loc>[^<]*\/admin[^<]*<\/loc>[\s\S]*?<\/url>/g, "");
  const removed = (before.match(/<loc>/g) ?? []).length - (after.match(/<loc>/g) ?? []).length;
  writeFileSync(sitemapPath, after);
  step(
    `sitemap: ${(after.match(/<loc>/g) ?? []).length} canonical URLs (${removed} duplicates removed)`,
  );
}

step(`done — ${pages.length} static pages + Worker at dist/server/index.mjs`);

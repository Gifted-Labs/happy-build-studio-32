/**
 * The site's fixed URLs, in one place because two very different things need
 * them: vite.config.ts (which pages to prerender) and the sitemap.
 *
 * Deliberately free of imports — vite.config.ts loads this file while building
 * its own config, long before anything else in src/ can run.
 */

/**
 * Pages whose content lives in code. Built to static HTML at deploy time and
 * served as Workers assets: free, unmetered, and exempt from the Workers Free
 * plan's 10 ms CPU limit.
 */
export const STATIC_PAGES = [
  "/",
  "/about",
  "/get-involved",
  "/donate",
  "/contact",
  "/faq",
] as const;

/**
 * Pages whose content lives in D1 and is edited in /admin. These are rendered on
 * each request instead — prerendering them would freeze the content at deploy
 * time, which is the one thing a CMS must not do.
 *
 * `/projects/:slug` is dynamic for the same reason and cannot be listed here;
 * the sitemap enumerates those from the database.
 */
export const DYNAMIC_PAGES = ["/projects", "/news"] as const;

/** True for a path whose HTML must never be written to a static asset. */
export function isDynamicPath(path: string): boolean {
  return (
    path === "/projects" ||
    path.startsWith("/projects/") ||
    path === "/news" ||
    path.startsWith("/admin")
  );
}

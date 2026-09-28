/**
 * The sitemap, served by the Worker rather than built as a static file.
 *
 * TanStack Start writes a sitemap from the pages it prerenders, which stopped
 * being the whole site once /projects, /projects/:slug and /news started reading
 * D1 per request — a project added in /admin would never appear in a file fixed
 * at deploy time. So the plugin's sitemap is off (see vite.config.ts) and this
 * builds the list from the database on request.
 */
import { DYNAMIC_PAGES, STATIC_PAGES } from "../site-pages";
import { getDb } from "./env";

/**
 * Canonical origin. Always the live site, never the requesting host: the preview
 * subdomain serves the same content and must not advertise its own URLs.
 */
const SITE_URL = (
  import.meta.env?.VITE_SITE_URL ?? "https://lifestorycharitablefoundation.com"
).replace(/\/$/, "");

type Entry = { path: string; lastmod?: string };

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Project URLs, newest first, each dated by its last edit. */
async function projectEntries(): Promise<Entry[]> {
  const db = getDb();
  if (!db) return [];

  const { results } = await db
    .prepare(
      `SELECT slug, updated_at FROM projects WHERE published = 1 ORDER BY sort_date DESC, slug`,
    )
    .all<{ slug: string; updated_at: string }>();

  return (results ?? []).map((row) => ({
    path: `/projects/${row.slug}`,
    lastmod: row.updated_at?.slice(0, 10),
  }));
}

export async function renderSitemap(): Promise<Response> {
  const entries: Entry[] = [
    ...STATIC_PAGES.map((path) => ({ path })),
    ...DYNAMIC_PAGES.map((path) => ({ path })),
  ];

  try {
    entries.push(...(await projectEntries()));
  } catch (error) {
    // A sitemap missing its project URLs is a far smaller problem than a 500 at
    // a URL every crawler fetches, so the rest of the list still goes out.
    console.error("[sitemap] Could not list projects:", error);
  }

  const urls = entries
    .map(({ path, lastmod }) => {
      const loc = `<loc>${escapeXml(`${SITE_URL}${path === "/" ? "/" : path}`)}</loc>`;
      return `  <url>\n    ${loc}${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""}\n  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      // Crawlers refetch this often; an hour at the edge keeps it off D1.
      "cache-control": "public, max-age=3600",
    },
  });
}

import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { renderSitemap } from "./lib/server/sitemap";
import { handleUpload } from "./lib/server/uploads";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

/**
 * Hosts whose pages belong in search results. Everything else — the workers.dev
 * URL, per-deployment preview URLs, and any preview subdomain — serves the same
 * content, so without this they compete with the real site for its own rankings
 * and expose pre-release pages to crawlers.
 */
const INDEXABLE_HOSTS = new Set([
  "lifestorycharitablefoundation.com",
  "www.lifestorycharitablefoundation.com",
]);

/** Tell crawlers to leave non-production hosts alone. */
function applyIndexingPolicy(request: Request, response: Response): Response {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  // The admin area is never indexable, on any host.
  if (INDEXABLE_HOSTS.has(host) && !url.pathname.startsWith("/admin")) return response;

  // Headers on a returned Response can be immutable; clone to be safe.
  const headers = new Headers(response.headers);
  headers.set("x-robots-tag", "noindex, nofollow");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const { pathname } = new URL(request.url);

      // Built from D1 rather than shipped as a static file, so outreaches added
      // in /admin are listed. Handled before the router because it is not a page.
      if (pathname === "/sitemap.xml") {
        return applyIndexingPolicy(request, await renderSitemap());
      }

      // Photograph uploads from the admin area. Handled here rather than as a
      // server function because the body is a file; it verifies Access itself.
      if (pathname === "/admin/upload") {
        return applyIndexingPolicy(request, await handleUpload(request));
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return applyIndexingPolicy(request, await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};

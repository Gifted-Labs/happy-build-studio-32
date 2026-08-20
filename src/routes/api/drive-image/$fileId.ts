import { createFileRoute } from "@tanstack/react-router";

// Proxies a Google Drive file's actual bytes through our own server, instead
// of hotlinking Google's `thumbnailLink` (lh3.googleusercontent.com/drive-storage/...).
// That link is a short-lived, signed CDN URL not meant for permanent public
// embedding — it intermittently returns 503s under normal hotlinked traffic,
// which is why real photos would randomly fail to render on the site.
// Fetching the file directly via the documented `alt=media` Drive API
// endpoint and streaming it from our own origin is stable and cacheable.
//
// We also cache successful responses at the edge (Cloudflare's `caches.default`,
// when available): every visitor's page loads the same handful of hero/gallery
// photos, and fetching each one fresh from Google per-request is exactly the
// kind of repeated automated traffic that trips Google's per-IP abuse
// protection ("automated queries" 403s) on a shared API key.
function getEdgeCache(): Cache | undefined {
  const caches = (globalThis as { caches?: { default?: Cache } }).caches;
  return caches?.default;
}

async function fetchDriveFile(fileId: string, apiKey: string): Promise<Response> {
  const url = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media&key=${apiKey}`;
  return fetch(url, { signal: AbortSignal.timeout(15000) });
}

export const Route = createFileRoute("/api/drive-image/$fileId")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const edgeCache = getEdgeCache();
        const cached = await edgeCache?.match(request).catch(() => undefined);
        if (cached) return cached;

        const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
        if (!apiKey) {
          return new Response("Google Drive is not configured", { status: 404 });
        }

        let upstream: Response;
        try {
          upstream = await fetchDriveFile(params.fileId, apiKey);
          // Google's infra occasionally errors transiently (5xx, or a 403
          // "automated queries" abuse-protection response); a couple of
          // short-delay retries clears almost all of those without the
          // client ever seeing it.
          for (let attempt = 0; attempt < 2 && !upstream.ok && upstream.status >= 400; attempt++) {
            await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
            upstream = await fetchDriveFile(params.fileId, apiKey);
          }
        } catch (error) {
          console.error("Failed to fetch Drive image", params.fileId, error);
          return new Response("Failed to fetch image", { status: 502 });
        }

        if (!upstream.ok || !upstream.body) {
          console.error(
            "Drive image fetch failed",
            params.fileId,
            upstream.status,
            upstream.statusText,
          );
          return new Response("Image not found", { status: 404 });
        }

        const bytes = await upstream.arrayBuffer();
        const response = new Response(bytes, {
          status: 200,
          headers: {
            "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
            // File bytes for a given Drive file id don't change day to day,
            // so let browsers cache aggressively.
            "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
          },
        });

        await edgeCache?.put(request, response.clone()).catch(() => undefined);
        return response;
      },
    },
  },
});

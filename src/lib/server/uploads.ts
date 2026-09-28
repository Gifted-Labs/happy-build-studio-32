/**
 * Photograph uploads from the admin area into R2.
 *
 * A plain endpoint rather than a server function: the body is a file, and
 * routing megabytes of binary through the RPC encoding would buy nothing.
 *
 * Two rules shape the rest of this file.
 *
 * **Metadata is removed, not trusted.** These are photographs of children and of
 * people receiving help, taken on phones, which record GPS coordinates by
 * default. Publishing one with its EXIF intact would put the location of a
 * children's home on the internet. Any file whose metadata cannot be found and
 * removed with certainty is rejected rather than uploaded.
 *
 * **The file decides its type, not the browser.** `file.type` is whatever the
 * client claims. The first bytes are checked instead.
 */
import { AccessDenied, requireAdmin } from "./access";
import { getMediaBucket } from "./env";
import { detect, stripJpegMetadata, stripPngMetadata } from "./image-metadata";

/** Comfortably above a phone photograph, far below what a Worker can hold. */
const MAX_BYTES = 20 * 1024 * 1024;

/** The editor reads these answers directly, so every failure carries a message. */
function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function refuse(error: string, status = 400): Response {
  return json({ ok: false, error }, status);
}

/**
 * The folder an upload lands in, e.g. `projects/krofrom-christmas-outreach`.
 *
 * Supplied by the client, so it is validated rather than trusted: without this a
 * crafted prefix could write over `site/hero.jpg` or escape the bucket layout
 * entirely.
 */
function cleanPrefix(value: string | null): string | null {
  const prefix = (value ?? "").trim().replace(/^\/+|\/+$/g, "");
  if (!prefix) return "uploads";
  if (!/^[a-z0-9][a-z0-9/-]{0,80}$/.test(prefix) || prefix.includes("//") || prefix.includes(".."))
    return null;
  return prefix;
}

/** A readable, collision-proof object name derived from what was uploaded. */
function objectKey(prefix: string, filename: string, extension: string): string {
  const stem =
    filename
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "photo";

  return `${prefix}/${stem}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
}

export async function handleUpload(request: Request): Promise<Response> {
  if (request.method !== "POST") return refuse("Use POST to upload a photograph.", 405);

  try {
    await requireAdmin(request);
  } catch (error) {
    const reason = error instanceof AccessDenied ? error.message : String(error);
    console.warn("[upload] denied:", reason);
    return refuse("Not authorised.", 403);
  }

  const bucket = getMediaBucket();
  if (!bucket) {
    return refuse(
      "No image storage is configured on this environment, so the photograph was not saved.",
      500,
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return refuse("That upload could not be read. Try again.");
  }

  const file = form.get("file");
  if (!(file instanceof File)) return refuse("No photograph was attached.");
  if (file.size === 0) return refuse("That file is empty.");
  if (file.size > MAX_BYTES) {
    return refuse(
      `That photograph is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is ${MAX_BYTES / 1024 / 1024} MB.`,
    );
  }

  const prefix = cleanPrefix(form.get("prefix") as string | null);
  if (!prefix) return refuse("That destination folder is not a valid one.");

  const bytes = new Uint8Array(await file.arrayBuffer());
  const detected = detect(bytes);
  if ("error" in detected) return refuse(detected.error, 415);

  const cleaned = detected.kind === "jpeg" ? stripJpegMetadata(bytes) : stripPngMetadata(bytes);
  if (!cleaned) {
    return refuse(
      "That image could not be read well enough to remove its location data, so it was not " +
        "uploaded. Open it and re-save it as a JPEG, then try again.",
      422,
    );
  }

  const key = objectKey(prefix, file.name || "photo", detected.extension);

  try {
    await bucket.put(key, cleaned, {
      httpMetadata: {
        contentType: detected.contentType,
        // Keys carry a random suffix, so an object is never replaced in place
        // and can be cached indefinitely.
        cacheControl: "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[upload] put failed:", error);
    return refuse("The photograph could not be saved. Try again.", 500);
  }

  console.log(`[upload] stored ${key} (${cleaned.length} bytes, was ${bytes.length})`);
  return json({ ok: true, key });
}

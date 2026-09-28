import { useRef, useState } from "react";

/**
 * Choose photographs and upload them to R2.
 *
 * The endpoint (src/lib/server/uploads.ts) strips location data before storing
 * anything, so the only thing this component must get right is reporting back
 * what happened: an upload that silently failed would leave the editor thinking
 * a photograph is on the page when it is not.
 */

export type UploadOutcome = { ok: true; key: string } | { ok: false; error: string };

async function uploadOne(file: File, prefix: string): Promise<UploadOutcome> {
  const body = new FormData();
  body.append("file", file);
  body.append("prefix", prefix);

  let response: Response;
  try {
    response = await fetch("/admin/upload", { method: "POST", body, credentials: "same-origin" });
  } catch {
    return { ok: false, error: "The upload did not reach the server. Check the connection." };
  }

  // An expired Access session answers with its sign-in page, not JSON. Saying so
  // is more use than "unexpected token < in JSON".
  if (!response.headers.get("content-type")?.includes("application/json")) {
    return {
      ok: false,
      error: "Your sign-in has expired. Reload this page, sign in again, and retry the upload.",
    };
  }

  const result = (await response.json()) as UploadOutcome;
  return result;
}

export function UploadButton({
  prefix,
  label,
  multiple = false,
  onUploaded,
}: {
  /** Folder in the bucket, e.g. "projects/krofrom-christmas-outreach". */
  prefix: string;
  label: string;
  multiple?: boolean;
  /** Called once per successfully stored photograph, with its object key. */
  onUploaded: (key: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    const chosen = Array.from(files);
    for (const [index, file] of chosen.entries()) {
      setStatus(
        chosen.length === 1
          ? `Uploading ${file.name}…`
          : `Uploading ${index + 1} of ${chosen.length}…`,
      );

      const result = await uploadOne(file, prefix);
      if (!result.ok) {
        // Stop at the first failure: continuing would bury the message under
        // later uploads and leave a half-filled gallery either way.
        setError(`${file.name}: ${result.error}`);
        setStatus(null);
        if (input.current) input.current.value = "";
        return;
      }
      onUploaded(result.key);
    }

    setStatus(`Uploaded ${chosen.length} photograph${chosen.length === 1 ? "" : "s"}.`);
    // Let the same file be chosen again after a mistake.
    if (input.current) input.current.value = "";
  }

  return (
    <div className="mt-2">
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png"
        multiple={multiple}
        onChange={(event) => void onFiles(event.target.files)}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => input.current?.click()}
        disabled={status?.startsWith("Uploading") ?? false}
        className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-50"
      >
        {label}
      </button>
      {status ? <span className="ml-3 text-xs text-slate-500">{status}</span> : null}
      {error ? (
        <p className="mt-2 rounded bg-red-50 p-2 text-xs text-red-800" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

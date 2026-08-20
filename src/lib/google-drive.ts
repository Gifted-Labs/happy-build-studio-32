import { createServerFn } from "@tanstack/react-start";

export type DrivePhoto = {
  id: string;
  name: string;
  url: string;
  alt: string;
};

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
};

type DriveFilesListResponse = {
  files?: DriveFile[];
  error?: { message?: string };
};

// The Drive folder ID env var is sometimes pasted straight from the browser
// URL (e.g. "folders/1BNXW..."); tolerate that instead of requiring the bare ID.
function normalizeFolderId(raw: string): string {
  return raw
    .trim()
    .replace(/^folders\//, "")
    .replace(/\/+$/, "");
}

async function listChildren(apiKey: string, parentId: string): Promise<DriveFile[]> {
  const url = new URL("https://www.googleapis.com/drive/v3/files");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("q", `'${parentId}' in parents and trashed = false`);
  url.searchParams.set("fields", "files(id,name,mimeType)");
  url.searchParams.set("orderBy", "name");
  url.searchParams.set("pageSize", "200");

  const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  const data = (await response.json()) as DriveFilesListResponse;

  if (!response.ok) {
    console.error("Google Drive API error:", data.error?.message ?? response.statusText);
    return [];
  }
  return data.files ?? [];
}

function toPhotos(files: DriveFile[], alt: string, limit: number): DrivePhoto[] {
  return files
    .filter((file) => file.mimeType.startsWith("image/"))
    .slice(0, limit)
    .map((file) => ({
      id: file.id,
      name: file.name,
      alt,
      // Proxied through our own server (see routes/api/drive-image/$fileId)
      // rather than Google's thumbnailLink — that signed CDN URL is
      // short-lived and intermittently 503s under normal hotlinked traffic.
      url: `/api/drive-image/${file.id}`,
    }));
}

export type ProjectPhotoSets = {
  /** Books & Pens 2022 — school-supplies donation, Breman M/A Basic School */
  educationAccess: DrivePhoto[];
  /** Orphanage 2020 + Colombia-Krofrom 2025 — food/compassion outreach events */
  communitySupportDrive: DrivePhoto[];
};

const EMPTY_PHOTO_SETS: ProjectPhotoSets = { educationAccess: [], communitySupportDrive: [] };

/**
 * Server-only: reads the shared Google Drive folder ("Anyone with the link"
 * viewer access) and sorts its per-event subfolders into the two site
 * projects that genuinely match their content:
 *  - "BOOKS&PENS 2022"                -> Education Access
 *  - "OPHANAGE 2020" + "COLOMBIA-KROFROM" -> Community Support Drive
 *
 * Clean Water Access and Community Health Outreach have no matching real
 * photos in the folder, so they're deliberately left out here.
 *
 * Requires GOOGLE_DRIVE_API_KEY and GOOGLE_DRIVE_FOLDER_ID env vars. Returns
 * empty arrays (rather than throwing) when unset or on any API error, so
 * pages fall back to their placeholder images.
 */
export const getProjectPhotoSets = createServerFn({ method: "GET" }).handler(
  async (): Promise<ProjectPhotoSets> => {
    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
    const rootFolder = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!apiKey || !rootFolder) {
      return EMPTY_PHOTO_SETS;
    }

    try {
      const rootId = normalizeFolderId(rootFolder);
      const children = await listChildren(apiKey, rootId);
      const subfolders = children.filter(
        (file) => file.mimeType === "application/vnd.google-apps.folder",
      );

      const booksAndPens = subfolders.find((f) => /books\s*&?\s*pens/i.test(f.name));
      const orphanage = subfolders.find((f) => /o?rphan|ophanage/i.test(f.name));
      const colombiaKrofrom = subfolders.find((f) => /colombia|krofrom/i.test(f.name));

      const [educationFiles, orphanageFiles, colombiaFiles] = await Promise.all([
        booksAndPens ? listChildren(apiKey, booksAndPens.id) : Promise.resolve([]),
        orphanage ? listChildren(apiKey, orphanage.id) : Promise.resolve([]),
        colombiaKrofrom ? listChildren(apiKey, colombiaKrofrom.id) : Promise.resolve([]),
      ]);

      return {
        educationAccess: toPhotos(
          educationFiles,
          "Exercise books and pens donated to pupils at Breman M/A Basic School, Kumasi",
          10,
        ),
        communitySupportDrive: [
          ...toPhotos(
            orphanageFiles,
            "Foodstuff and grocery donation at Remar Kumasi Children's Home, Patasi",
            6,
          ),
          ...toPhotos(colombiaFiles, "Christmas outreach meal at Krofrom, Kumasi", 6),
        ],
      };
    } catch (error) {
      console.error("Failed to fetch Google Drive project photos:", error);
      return EMPTY_PHOTO_SETS;
    }
  },
);

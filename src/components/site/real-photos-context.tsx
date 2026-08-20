import { createContext, useContext, type ReactNode } from "react";

export type RealPhotos = {
  /** Real photos from the Books & Pens 2022 education outreach. */
  education: string[];
  /** Real photos from the Orphanage 2020 / Colombia-Krofrom community outreaches. */
  community: string[];
};

const EMPTY_PHOTOS: RealPhotos = { education: [], community: [] };

const RealPhotosContext = createContext<RealPhotos>(EMPTY_PHOTOS);

export function RealPhotosProvider({
  photos,
  children,
}: {
  photos: RealPhotos;
  children: ReactNode;
}) {
  return <RealPhotosContext.Provider value={photos}>{children}</RealPhotosContext.Provider>;
}

/**
 * Returns a real Drive photo for a category if any were loaded, otherwise
 * the given placeholder. `index` picks which real photo to use (wrapping
 * around the list) so repeated calls on the same page show variety instead
 * of the same single photo everywhere.
 *
 * Only use this for decorative banner/gallery images — never for avatars
 * tied to a fictional name, role, or quote.
 */
export function useRealPhoto(category: keyof RealPhotos, index: number, fallback: string): string {
  const photos = useContext(RealPhotosContext);
  const list = photos[category];
  if (list.length === 0) return fallback;
  return list[index % list.length];
}

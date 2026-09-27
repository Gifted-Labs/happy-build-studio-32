/**
 * Single source of truth for every photograph on the site.
 *
 * Each slot has a `path` (where the original lives in the R2 bucket) and a
 * `fallback` (the temporary Stitch URL currently in use). `mediaSrc` returns
 * the R2 original once `VITE_MEDIA_HOST` is set, and the fallback until then —
 * so the real photos drop in by setting one environment variable and uploading
 * files at the paths below. Nothing else in the codebase needs to change.
 *
 * Delivery goes through Cloudflare image transformations (see `cfImage`), which
 * resize and re-encode on the fly. Originals should be the largest available;
 * do not pre-resize them.
 */

const STITCH = "https://lh3.googleusercontent.com/aida-public";

const stock = {
  hero: `${STITCH}/AB6AXuCUiZedOspvoax75aOqwYEAFd9x4ocwb3duusyDUWcEc_LY_BBnxV_-jppwffBln-IGF7JMwIEsoRQihY23Ad3czGWNXu6gLBpjvXB9z-Z8uzhQzCPUSqKj09peffHRsseDD0M5O3DzZS4Dm7zIyxeun3EtiwkoSARW_Fg8VY8jbBACqcLc6Je1lyk4si_l_rEgbgN2TRCgVYJXXwsxESfXIztIvGahChHAOKE7JZs9TDQlXlQZ-O3ZuQ`,
  about: `${STITCH}/AB6AXuDkqkr_eKhXcFCdoH3DL7SSr3LLJXp5te4_ow7xkXTaxbWVwohdyEeQ18KUTB-Y8TSbP_5osvgFJNld0KVlFWNNbF-JzuZAhEcIbYztAXEfDEDdJRp7NpzSJhw5RshMLB6VYEvFM_9p3Dr1mgGziRDJdBeq6AAbOtkdxgjmwBe8richKMGU2Zej-nUO2i8tz5cZy5EVZo5lkYDnVbSwIo2gILCIRr5xg-dahMfct0xvuoLxpn64-lWIMQ`,
  community: `${STITCH}/AB6AXuDK-DRJPTtY8fZkl0-2Z9ovuJDoGVFhHIvc9FyZ1ZqbZwbSL0051U1OUVlLXeSACe9_vo1TaHrNF0cOBGCyARZj8LR-SxO6NuZpOMr9ukhzu57HqTLcoENPYSFuCTaBLSFMCxTZIAY7b6t2Tin7M-mTd-9rBDBPfaSr6ogJVK52RoXJM-4VnLH7w7wQI_NXw1_1-A2x0Ps1sNpUf1jKbtYifC1CHUp_aHCK4mwtgJn7I0_XwTgr3MmFhA`,
  education: `${STITCH}/AB6AXuBCA7KQHl5sxpX799eLNbYZ0ev5K0U2uinFh-OXOm9Vc16KJqX106YPdpMJSsHDKk9qjhIZqiCEG0QwQ7ynl2ASmFyOrZ3rexuveWqTwIgYQH1GqOqXkdAVygEz2RVRYHf_Hhd-LNhs-RcL6R1wPe2V49taTew5BzdmHBrYnsdseXutaxUc_0JRF7fbVMsfw7CDR4U1uXGu--xEk750Wjo71A-ZdRBP8hETrduqrOp41HQnUbA59n2oCA`,
  water: `${STITCH}/AB6AXuA0eCmEkDEG_M5aeXAtJ8b1TDiDn3NQSzNwjMNnQHxkpwD53MCIeBKNuXrWiJ0xWtGHqWJiIZLEAnTwCGtkiaQ0kZx7N7H7HiIEcDqtRBuY9f_wee0QfhiOhzwF9qJpq5_ESwaNKn1YmEnSXEZ4ktz2lmrS__h8Av4YWZXyMqCKBLVySwusPYVrbgfTnIz6OGfXvArSCYReMBOq6pbgVeOVydI55-59rZhcfVByfOao-BiuUf3LZNyrdw`,
  health: `${STITCH}/AB6AXuBCdIYlHU0r1pPf81EGne1bifk3SMmVrYQOfRbKmtRqkSbZ1GyPvsBn49fLI2ZBD_-FVHvkufatDS70uiW8IHdRX-pi3diGpKTzxoQwywAzg-Tevhl9TcpSbx_LZAkR4wke_LxE-Wbzvy-rakc5I1OPaQ4vgM15RV1LEj8CuyEptbXlv06_eshvhhCbfZN_mWIsLbwVvu4PKvFn423gqVg86musB_mLljAcuoyBDA_rZfjK5WktRz7l5A`,
  news1: `${STITCH}/AB6AXuCrPnPr3180x9otLK7KATn1aA4MIYNTBkuXnqF5BXUY0ch3HtXHRIUNGw3uthQWh3apMzN0vFHvN1ZNAzIzbYvQXcqH3aEmDR7tdHI_nNF39yhiDSJByTpUaT7WgPt3jJn8i0yCfuBTLY4rn5E3AFaWYTxMoOWvdoZ-0d-zDbDwZJIFRPriaeP1cHdAcJhrzb-Zww5tadS9ZmIGlbZ2PyfSTWzMpKEVka6Sl_jiIaD93rsOZD-Za-Ag2g`,
  news2: `${STITCH}/AB6AXuALqinUzqYCOxqFynwS9hKbbMPPQu3LHvmzIgT8kMLVbBcou0GhwhWHg7rl8MsLo-7ZHd197ZliLYLf40K_qi-p6ETPeYaiYauWOwDEvgaGQvwEfGy9aTEHUZGYJCWHhFDrVELN2qBkvpFSdHg5mh1DuTOa4JjOBKXCdgxSZA2ihCjkwUZ_XAXQ3WiBEBD2wTK-sggXWEoTw1PXgae0wFJlfdJR4zTohXjaqtQwQ3Tu94HbJ-WVyYXyRA`,
  news3: `${STITCH}/AB6AXuBaIVrTzUS7XK2lifzCg3gKVubYIgHHMCwsKIQ2mdIJ2fS-dvvXC3lbhBPpEgL3YlqWDWP4NgF8nAc6M1qoz2maJXm2vyF2Pu8CgAkieyyyxrXlnMLkTxYI8AzzhdMcyWB8Pow0mVake7LhUg1i2FIF3rPwKBi2Q8XsiMH-qLFH1KPI0eZvdPSd-QMcvL9egBPJaiiuDVAyL15weQIWI5Ys6D_wSzvZVi8ff67cGxwsVtYl63SXCoAlMw`,
  portrait: `${STITCH}/AB6AXuBoPaOmA2ZZb_-Mu-pHCyKK_KAAhGeddqDJgeffhM9xKTZVXJJO1DDsvayRmlXkfrA9Ljn5R2-8YZfEq5dj-iyVTG9apF_CXmUR0cEt8xDFRactSSisfURUbPELvFx6mUbxl8cp1Bj_OOkecidaWf2bVdSq1-cdk7oAOpm1coirYHa84u2eGDRFqV9INN7vkn80KzzgYAxLkoyZS7Ofw_ZlBMcuFYnL-pSlw5P4txjU6vHegdVYIu_VRA`,
  landscape: `${STITCH}/AB6AXuA2T-BIPmm9vR1mFOCYv0F4f7tWZgI3hPQK-r-4nSj6H5UKLwedKGVub514pTo5jEbyFBQYMtw4i-3kEPQ8zQqUBECGR4f4aQe7tgN_fxmVhN3vXj33cZkzUs0KMnUCHXrNKsJV3WoAGzb_Ob49WOnSzkEYBYtmRweAlsrww6KLkql3CcVUcOI7-zpsWRQAJxfjN3NGk_5y8-ohDI0Trb4q9ZxZAzPnS8NMotI5w9E3iO6ZMfhlChhMzA`,
} as const;

type Slot = { path: string; fallback: string };

const slot = (path: string, fallback: string): Slot => ({ path, fallback });

/**
 * Every image slot on the site. `path` is the object key to upload into R2.
 * Replace the fallbacks only if you want a different stand-in; once
 * VITE_MEDIA_HOST is set they are no longer served.
 */
export const media = {
  // Site-wide slots, reused across pages.
  hero: slot("site/hero.jpg", stock.hero),
  about: slot("site/about.jpg", stock.about),
  community: slot("site/community.jpg", stock.community),
  education: slot("site/education.jpg", stock.education),
  water: slot("site/water.jpg", stock.water),
  health: slot("site/health.jpg", stock.health),
  portrait: slot("site/portrait.jpg", stock.portrait),
  landscape: slot("site/landscape.jpg", stock.landscape),

  // News stories.
  news1: slot("news/community-hub.jpg", stock.news1),
  news2: slot("news/digital-divide.jpg", stock.news2),
  news3: slot("news/volunteer-program.jpg", stock.news3),

  // Team portraits — replace both the photo and the person in
  // src/components/about/reference-about-layout.tsx.
  team1: slot("team/01.jpg", stock.portrait),
  team2: slot("team/02.jpg", stock.community),
  team3: slot("team/03.jpg", stock.about),

  // Social sharing card, 1200x630.
  og: slot("site/og.jpg", stock.hero),

  /**
   * Project photographs, one set per outreach. `hero` leads the project page,
   * `secondary` supports it, and 01-05 fill the gallery. Paths are object keys in
   * the public R2 bucket named by VITE_MEDIA_HOST; the fallbacks are only ever
   * seen if that variable is unset.
   */
  "books-and-pens/hero": slot("projects/books-and-pens/hero.jpg", stock.education),
  "books-and-pens/secondary": slot("projects/books-and-pens/secondary.jpg", stock.education),
  "books-and-pens/01": slot("projects/books-and-pens/01.jpg", stock.education),
  "books-and-pens/02": slot("projects/books-and-pens/02.jpg", stock.about),
  "books-and-pens/03": slot("projects/books-and-pens/03.jpg", stock.community),
  "books-and-pens/04": slot("projects/books-and-pens/04.jpg", stock.news1),
  "books-and-pens/05": slot("projects/books-and-pens/05.jpg", stock.health),

  "krofrom-christmas-outreach/hero": slot(
    "projects/krofrom-christmas-outreach/hero.jpg",
    stock.community,
  ),
  "krofrom-christmas-outreach/secondary": slot(
    "projects/krofrom-christmas-outreach/secondary.jpg",
    stock.community,
  ),
  "krofrom-christmas-outreach/01": slot(
    "projects/krofrom-christmas-outreach/01.jpg",
    stock.community,
  ),
  "krofrom-christmas-outreach/02": slot("projects/krofrom-christmas-outreach/02.jpg", stock.about),
  "krofrom-christmas-outreach/03": slot("projects/krofrom-christmas-outreach/03.jpg", stock.news1),
  "krofrom-christmas-outreach/04": slot("projects/krofrom-christmas-outreach/04.jpg", stock.health),
  "krofrom-christmas-outreach/05": slot(
    "projects/krofrom-christmas-outreach/05.jpg",
    stock.education,
  ),

  "remar-childrens-home/hero": slot("projects/remar-childrens-home/hero.jpg", stock.community),
  "remar-childrens-home/secondary": slot(
    "projects/remar-childrens-home/secondary.jpg",
    stock.about,
  ),
  "remar-childrens-home/01": slot("projects/remar-childrens-home/01.jpg", stock.community),
  "remar-childrens-home/02": slot("projects/remar-childrens-home/02.jpg", stock.health),
  "remar-childrens-home/03": slot("projects/remar-childrens-home/03.jpg", stock.news1),
  "remar-childrens-home/04": slot("projects/remar-childrens-home/04.jpg", stock.education),
  "remar-childrens-home/05": slot("projects/remar-childrens-home/05.jpg", stock.about),
} satisfies Record<string, Slot>;

export type MediaKey = keyof typeof media;

/** Host serving the R2 bucket, e.g. "https://media.lifestory.org". */
const MEDIA_HOST = (import.meta.env.VITE_MEDIA_HOST ?? "").replace(/\/$/, "");

/**
 * Whether to route images through Cloudflare transformations. Defaults to on in
 * production once a media host exists — `/cdn-cgi/image/` is served by the zone,
 * so it does not resolve on a local dev server. Force it with VITE_IMAGE_TRANSFORM.
 */
const TRANSFORM = import.meta.env.VITE_IMAGE_TRANSFORM
  ? import.meta.env.VITE_IMAGE_TRANSFORM !== "false"
  : Boolean(MEDIA_HOST) && import.meta.env.PROD;

/** Resolve a slot to the URL of its original, full-size image. */
export function mediaSrc(key: MediaKey): string {
  const entry = media[key];
  return MEDIA_HOST ? `${MEDIA_HOST}/${entry.path}` : entry.fallback;
}

export type TransformOptions = {
  width?: number;
  height?: number;
  quality?: number;
  fit?: "scale-down" | "contain" | "cover" | "crop" | "pad";
  format?: "auto" | "avif" | "webp" | "jpeg";
};

/**
 * Wrap a source URL in a Cloudflare image transformation.
 *
 * Counts as one "unique transformation" per distinct set of options per image,
 * against the 5,000/month free allowance. Cached derivatives keep serving after
 * the cap, so steady-state usage is near zero once the gallery stops growing.
 */
export function cfImage(src: string, options: TransformOptions = {}): string {
  if (!TRANSFORM) return src;

  const { width, height, quality = 80, fit, format = "auto" } = options;
  const params = [
    width && `width=${width}`,
    height && `height=${height}`,
    `quality=${quality}`,
    fit && `fit=${fit}`,
    `format=${format}`,
  ].filter(Boolean);

  return `/cdn-cgi/image/${params.join(",")}/${src}`;
}

/** Default responsive width ladder. */
export const DEFAULT_WIDTHS = [400, 640, 800, 1200, 1600, 2000];

/** Build a `srcset` string for the given source across the given widths. */
export function srcSet(src: string, widths: number[], options: TransformOptions = {}): string {
  if (!TRANSFORM) return "";
  return widths.map((w) => `${cfImage(src, { ...options, width: w })} ${w}w`).join(", ");
}

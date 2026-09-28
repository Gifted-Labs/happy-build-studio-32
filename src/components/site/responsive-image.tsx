import { DEFAULT_WIDTHS, cfImage, resolveImage, srcSet, type MediaKey } from "../../lib/media";

type ResponsiveImageProps = {
  /**
   * Slot in the media manifest, an R2 object key from an admin upload, or a
   * ready-made URL. `resolveImage` tells them apart.
   */
  src: MediaKey | (string & {});
  alt: string;
  /** Intrinsic dimensions. Required — they reserve layout space and stop CLS. */
  width: number;
  height: number;
  className?: string;
  /** `sizes` attribute describing the rendered width at each breakpoint. */
  sizes?: string;
  /** Candidate widths for `srcset`. Defaults to the standard ladder. */
  widths?: number[];
  /**
   * Above-the-fold images: skip lazy loading and hint high priority so the LCP
   * image starts downloading immediately. Use for the hero only.
   */
  priority?: boolean;
  quality?: number;
  fit?: "scale-down" | "contain" | "cover" | "crop" | "pad";
};

/**
 * An `<img>` that serves appropriately-sized, modern-format images through
 * Cloudflare transformations, with dimensions always set.
 *
 * Decorative images still need an explicit `alt=""` — pass it deliberately
 * rather than omitting the prop, so a missing description is always a choice.
 */
export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  className,
  sizes = "100vw",
  widths = DEFAULT_WIDTHS,
  priority = false,
  quality = 80,
  fit,
}: ResponsiveImageProps) {
  const origin = resolveImage(src);

  // Never offer candidates larger than the image is ever rendered at 2x.
  const ladder = widths.filter((w) => w <= width * 2);
  const candidates = ladder.length > 0 ? ladder : [width];
  const set = srcSet(origin, candidates, { quality, fit });

  return (
    <img
      src={cfImage(origin, { width, quality, fit })}
      srcSet={set || undefined}
      sizes={set ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? "eager" : "lazy"}
      // `fetchPriority` steers the LCP image ahead of other subresources.
      fetchPriority={priority ? "high" : undefined}
      decoding={priority ? "sync" : "async"}
    />
  );
}

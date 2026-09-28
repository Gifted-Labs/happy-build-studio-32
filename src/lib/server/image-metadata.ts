/**
 * Reading and rewriting image files, without any Cloudflare binding in sight.
 *
 * Separate from uploads.ts so that these — the part with real parsing in it, and
 * the part that has to be right or a photograph reaches the internet with its
 * GPS coordinates attached — can be exercised on their own.
 */

export type Detected = { kind: "jpeg" | "png"; contentType: string; extension: string };

function startsWith(bytes: Uint8Array, signature: number[]): boolean {
  return signature.every((byte, index) => bytes[index] === byte);
}

/**
 * Identify the file from its leading bytes.
 *
 * HEIC gets its own answer because it is what an iPhone produces by default and
 * a Worker cannot convert it — without a specific message the person uploading
 * has no way to know what went wrong or what to do about it.
 */
export function detect(bytes: Uint8Array): Detected | { error: string } {
  if (startsWith(bytes, [0xff, 0xd8, 0xff])) {
    return { kind: "jpeg", contentType: "image/jpeg", extension: "jpg" };
  }
  if (startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { kind: "png", contentType: "image/png", extension: "png" };
  }

  // ISO base media container: "ftyp" at offset 4, brand at 8.
  const brand = new TextDecoder().decode(bytes.subarray(4, 12));
  if (brand.startsWith("ftyp") && /heic|heix|hevc|heim|heis|mif1|msf1/.test(brand.slice(4))) {
    return {
      error:
        "That photo is in Apple's HEIC format, which browsers cannot display. " +
        "On the iPhone: Settings → Camera → Formats → Most Compatible, or open the " +
        "photo and export it as JPEG, then upload that.",
    };
  }

  return { error: "Only JPEG and PNG photographs can be uploaded. Save the image as one first." };
}

function concat(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

/**
 * Find the end of the first complete image, skipping over the compressed data.
 *
 * Needed because phones append things after it — a second JPEG for a motion
 * photo, an MPF thumbnail — and that appended image carries its own EXIF and
 * XMP. Stripping the segments at the front and copying "the rest" verbatim
 * therefore still published the location data, just further down the file.
 *
 * Inside compressed data every 0xFF byte is stuffed with a following 0x00 or is
 * a restart marker, so a real EOI is unambiguous. Returns null if the image
 * never ends, which means the file is truncated.
 */
function findEndOfImage(bytes: Uint8Array, start: number): number | null {
  let index = start;

  while (index + 1 < bytes.length) {
    if (bytes[index] !== 0xff) {
      index += 1;
      continue;
    }

    const marker = bytes[index + 1];

    // Stuffed byte, fill byte, or a restart marker: part of the scan.
    if (marker === 0x00 || marker === 0xff || (marker >= 0xd0 && marker <= 0xd7)) {
      index += 2;
      continue;
    }

    if (marker === 0xd9) return index + 2;

    // Anything else starts a segment — a further scan in a progressive JPEG, or
    // the tables between scans. Skip its payload and keep going.
    if (index + 3 >= bytes.length) return null;
    const length = (bytes[index + 2] << 8) | bytes[index + 3];
    if (length < 2) return null;
    index += 2 + length;
  }

  return null;
}

/** An APP2 segment holds a colour profile rather than, say, an MPF index. */
function isIccProfile(segment: Uint8Array): boolean {
  return new TextDecoder().decode(segment.subarray(4, 15)) === "ICC_PROFILE";
}

/**
 * Rebuild a JPEG without its metadata segments, and without anything appended
 * after the image itself.
 *
 * APP0 (JFIF) and an APP2 colour profile are kept — dropping the profile visibly
 * shifts colour. Everything else in the APPn range goes, along with the comment
 * segment: APP1 carries EXIF and XMP, APP13 carries IPTC, and all of them can
 * hold GPS coordinates.
 *
 * Returns null if the structure does not parse, which the caller treats as a
 * refusal. A file we cannot walk is a file we cannot promise is clean.
 */
export function stripJpegMetadata(bytes: Uint8Array): Uint8Array | null {
  const kept: Uint8Array[] = [bytes.subarray(0, 2)];
  let index = 2;

  while (index + 1 < bytes.length) {
    if (bytes[index] !== 0xff) return null;

    const marker = bytes[index + 1];

    // Standalone markers carry no payload.
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) {
      kept.push(bytes.subarray(index, index + 2));
      index += 2;
      continue;
    }

    // Start of scan: the compressed image data runs from here to the EOI.
    if (marker === 0xda) {
      const end = findEndOfImage(bytes, index);
      if (end === null) return null;
      kept.push(bytes.subarray(index, end));
      return concat(kept);
    }

    if (index + 3 >= bytes.length) return null;
    const length = (bytes[index + 2] << 8) | bytes[index + 3];
    if (length < 2) return null;

    const end = index + 2 + length;
    if (end > bytes.length) return null;

    const segment = bytes.subarray(index, end);
    const isApp = marker >= 0xe0 && marker <= 0xef;
    const keep = !isApp || marker === 0xe0 || (marker === 0xe2 && isIccProfile(segment));
    if (keep && marker !== 0xfe) kept.push(segment);

    index = end;
  }

  // Ran out of file without reaching the image data.
  return null;
}

/** Chunks that can carry a location, a camera, a name, or a comment. */
const PNG_METADATA_CHUNKS = new Set(["tEXt", "zTXt", "iTXt", "eXIf"]);

/**
 * Rebuild a PNG without its text and EXIF chunks.
 *
 * PNG is a flat chunk list, so this only has to copy the ones worth keeping.
 * iCCP (the colour profile) stays for the same reason APP2 does in a JPEG.
 */
export function stripPngMetadata(bytes: Uint8Array): Uint8Array | null {
  const kept: Uint8Array[] = [bytes.subarray(0, 8)];
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const decoder = new TextDecoder();
  let index = 8;

  while (index + 8 <= bytes.length) {
    const length = view.getUint32(index);
    const type = decoder.decode(bytes.subarray(index + 4, index + 8));
    const end = index + 12 + length;
    if (end > bytes.length) return null;

    if (!PNG_METADATA_CHUNKS.has(type)) kept.push(bytes.subarray(index, end));

    index = end;
    if (type === "IEND") return concat(kept);
  }

  return null;
}

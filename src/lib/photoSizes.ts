import path from "node:path";
import sharp from "sharp";

/** Reads each photo's real width/height at build time so the gallery can show it in its original orientation. */
export async function photoSizes(photos: string[]) {
  return Promise.all(
    photos.map(async (src) => {
      try {
        const { width = 4, height = 3, orientation } = await sharp(path.join(process.cwd(), "public", src)).metadata();
        // EXIF orientations 5–8 are rotated 90°, so width and height swap on screen.
        return orientation && orientation >= 5 ? { w: height, h: width } : { w: width, h: height };
      } catch {
        return { w: 4, h: 3 };
      }
    })
  );
}

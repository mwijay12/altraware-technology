/* ============================================================
   Cloudinary helpers.

   Every project screenshot was requested as one fixed-width file
   (w_600) and then upscaled into a card that renders ~420 CSS px
   wide — 840 device px on a retina screen. That is a 40% upscale,
   which is exactly what "the pictures look broken/blurry" means.

   These helpers rewrite the transformation segment in place, so a
   URL keeps its version and public id but gains a dpr-aware srcSet.
   Non-Cloudinary URLs are returned untouched.
   ============================================================ */

const TRANSFORM_RE = /\/upload\/(?:[^/]*?\/)?(v\d+\/)/;

/** Rewrite a Cloudinary URL to a specific pixel width. */
export function cld(url: string, width: number): string {
  if (!url.includes("res.cloudinary.com")) return url;
  const withWidth = `f_auto,q_auto,w_${width},dpr_auto`;
  // Replace an existing transformation segment if present, else insert one.
  if (/\/upload\/[^/]*?(?:f_auto|w_\d+|q_auto)[^/]*\//.test(url)) {
    return url.replace(
      /\/upload\/[^/]*?(f_auto|w_\d+|q_auto)[^/]*\//,
      `/upload/${withWidth}/`
    );
  }
  return url.replace("/upload/", `/upload/${withWidth}/`);
}

/** Build a retina srcSet for a Cloudinary URL. */
export function cldSrcSet(url: string, widths: number[]): string {
  if (!url.includes("res.cloudinary.com")) return "";
  return widths
    .map((w) => `${cld(url, w)} ${w}w`)
    .join(", ");
}

/** True when a URL is a real, loadable picture as far as we can tell. */
export function isImageUrl(url: string): boolean {
  if (!url) return false;
  return /^(\/|https?:\/\/)/.test(url) && !/\.(mp4|webm|mov|m3u8)(\?|$)/i.test(url);
}

/** Media entries that point at a video file but are really stock films. */
export function isPlaceholderVideo(url: string): boolean {
  return /(media\.w3\.org|test-videos\.co\.uk|bigbuckbunny|sintel|blender\.org)/i.test(url);
}

export { TRANSFORM_RE };

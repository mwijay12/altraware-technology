/**
 * Cloudinary client-side direct uploader.
 * Uploads images/video from PC directly to Cloudinary using an
 * UNSIGNED upload preset. No secrets here — cloud name + preset are
 * public (NEXT_PUBLIC_) by design. Never put API secret in client code.
 */

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB

export function getCloudinaryConfig(): { cloudName: string; preset: string } {
  const cloudName = (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "").trim();
  const preset = (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "").trim();
  if (!cloudName || !preset) {
    throw new Error(
      "Cloudinary is not configured: set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local, then restart `next dev`."
    );
  }
  return { cloudName, preset };
}

export async function uploadFileToCloudinary(file: File): Promise<string> {
  const { cloudName, preset } = getCloudinaryConfig();

  const isVideo = file.type.startsWith("video/");
  const limit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > limit) {
    throw new Error(
      `File is too large (${(file.size / 1048576).toFixed(1)} MB). Limit is ${limit / 1048576} MB — shrink it or paste a URL instead.`
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  // NOTE: unsigned preset LAZIMA iwe "Unsigned" kwenye Cloudinary dashboard
  // (Settings → Upload → Upload presets → Signing Mode = Unsigned),
  // vinginevyo Cloudinary hujibu 401/403.
  const kind = isVideo ? "video" : "image";
  let response: Response;
  try {
    response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${kind}/upload`, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error("Could not reach Cloudinary — check your connection and try again.");
  }

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(
      `Cloudinary upload failed (${response.status}). Make sure preset "${preset}" is UNSIGNED on cloud "${cloudName}".${errText ? " Details: " + errText.slice(0, 200) : ""}`
    );
  }

  const data = await response.json().catch(() => null);
  if (!data?.secure_url) {
    throw new Error("Cloudinary did not return a secure_url — try again or paste a URL manually.");
  }
  return data.secure_url as string;
}

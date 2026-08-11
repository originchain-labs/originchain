import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";

const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
  "image/webp",
  "application/pdf",
]);

export async function detectAndValidateFileType(buffer: Buffer): Promise<{ ext: string; mime: string }> {
  const detected = await fileTypeFromBuffer(buffer);
  if (!detected || !ALLOWED_MIME_TYPES.has(detected.mime)) {
    throw new Error("INVALID_FILE_TYPE");
  }
  return detected;
}

export function sanitizeFileName(fileName: string): string {
  // Strip null bytes, path traversal characters, and replace any unsafe characters
  const cleanName = fileName
    .replace(/\0/g, "")
    .replace(/^.*[\\/]/, "") // strip leading directory path
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/^[._]+/, "file_");

  return cleanName || "unnamed_file";
}

export async function validateImageBuffer(buffer: Buffer, mimeType: string): Promise<Buffer> {
  if (mimeType.startsWith("image/")) {
    try {
      // Decode image metadata & pixel stream via sharp to confirm it's a valid, uncorrupted image.
      // Calling sharp(buffer).stats() forces sharp to decode header metadata and pixel data.
      await sharp(buffer).stats();
    } catch {
      throw new Error("INVALID_FILE_TYPE");
    }
  }
  // Return the ORIGINAL, UNMODIFIED buffer unchanged
  return buffer;
}


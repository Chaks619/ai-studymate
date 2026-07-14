import cloudinary from "@/config/cloudinary.js";
import type { UploadApiResponse } from "cloudinary";
import { Readable } from "stream";

export const uploadPdfToCloudinary = (
  buffer: Buffer,
  fileName: string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "ai-studymate/documents",
        resource_type: "raw",
        public_id: fileName.replace(".pdf", ""),
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(new Error("Cloudinary upload failed"));
        }

        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

export const uploadAvatarToCloudinary = (
  buffer: Buffer,
  userId: string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "ai-studymate/avatars",
        resource_type: "image",
        // One asset per user, overwritten on re-upload, so avatars can't
        // accumulate orphans in the account's media library.
        public_id: userId,
        overwrite: true,
        invalidate: true,
        transformation: [
          {
            width: 256,
            height: 256,
            crop: "fill",
            gravity: "face",
          },
        ],
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(new Error("Cloudinary upload failed"));
        }

        resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

/**
 * Best-effort cleanup. A failure here must not abort the surrounding
 * database deletion — an orphaned remote file is recoverable, a half-
 * deleted account is not.
 */
export const destroyCloudinaryAsset = async (
  publicId: string,
  resourceType: "raw" | "image"
): Promise<void> => {
  if (!publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error(
      `Failed to remove Cloudinary asset ${publicId}:`,
      error
    );
  }
};
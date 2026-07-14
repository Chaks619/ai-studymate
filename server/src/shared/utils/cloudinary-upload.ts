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
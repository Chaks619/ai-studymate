import multer from "multer";

import { isSupportedFile } from "@/modules/document/document.file-types.js";
import { ApiError, ERROR_CODES } from "@/shared/errors/index.js";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,

  limits: {
    fileSize: 20 * 1024 * 1024,
  },

  fileFilter(_req, file, cb) {
    if (!isSupportedFile(file.originalname, file.mimetype)) {
      // An ApiError here reaches the global handler and surfaces as a clean
      // 400 rather than a generic 500.
      return cb(
        ApiError.badRequest(
          "Unsupported file type. Upload a PDF, Word, Excel, text, or Markdown file.",
          ERROR_CODES.DOCUMENT_UNSUPPORTED_TYPE
        )
      );
    }

    cb(null, true);
  },
});

const AVATAR_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

export const uploadImage = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter(_req, file, cb) {
    if (!AVATAR_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        new Error("Only PNG, JPEG or WebP images are allowed")
      );
    }

    cb(null, true);
  },
});
import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,

  limits: {
    fileSize: 20 * 1024 * 1024,
  },

  fileFilter(req, file, cb) {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
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
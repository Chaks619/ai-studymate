export const DOCUMENT_STATUS = {
  UPLOADING: "UPLOADING",
  PROCESSING: "PROCESSING",
  READY: "READY",
  FAILED: "FAILED",
} as const;

export type DocumentStatus =
  (typeof DOCUMENT_STATUS)[keyof typeof DOCUMENT_STATUS];

export const DOCUMENT_LANGUAGE = {
  ENGLISH: "en",
  UNKNOWN: "unknown",
} as const;

export type DocumentLanguage =
  (typeof DOCUMENT_LANGUAGE)[keyof typeof DOCUMENT_LANGUAGE];
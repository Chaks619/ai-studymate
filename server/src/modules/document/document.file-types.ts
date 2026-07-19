export const DOCUMENT_TYPE = {
  PDF: "pdf",
  DOCX: "docx",
  XLSX: "xlsx",
  TXT: "txt",
  MD: "md",
} as const;

export type DocumentType =
  (typeof DOCUMENT_TYPE)[keyof typeof DOCUMENT_TYPE];

export interface DocumentTypeSpec {
  type: DocumentType;
  label: string;
  extensions: string[];
  mimeTypes: string[];
}

/**
 * The formats the pipeline can ingest. Everything downstream (summary, quiz,
 * flashcards, chat) works off `extractedText`, so adding a format is only a
 * matter of teaching the processor to read it — this list is the single source
 * of truth for what's accepted.
 */
export const SUPPORTED_DOCUMENT_TYPES: DocumentTypeSpec[] = [
  {
    type: DOCUMENT_TYPE.PDF,
    label: "PDF",
    extensions: ["pdf"],
    mimeTypes: ["application/pdf"],
  },
  {
    type: DOCUMENT_TYPE.DOCX,
    label: "Word",
    extensions: ["docx"],
    mimeTypes: [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
  },
  {
    type: DOCUMENT_TYPE.XLSX,
    label: "Excel",
    extensions: ["xlsx"],
    mimeTypes: [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
  },
  {
    type: DOCUMENT_TYPE.TXT,
    label: "Text",
    extensions: ["txt"],
    mimeTypes: ["text/plain"],
  },
  {
    type: DOCUMENT_TYPE.MD,
    label: "Markdown",
    extensions: ["md", "markdown"],
    mimeTypes: ["text/markdown", "text/x-markdown"],
  },
];

export function getExtension(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot >= 0 ? fileName.slice(dot + 1).toLowerCase() : "";
}

/**
 * Resolve a file to a supported type. Extension is checked first because
 * browser-supplied MIME types are unreliable for text formats (a `.md` file
 * often arrives as text/plain or application/octet-stream).
 */
export function resolveDocumentType(
  fileName: string,
  mimeType: string
): DocumentTypeSpec | null {
  const extension = getExtension(fileName);

  const byExtension = SUPPORTED_DOCUMENT_TYPES.find((spec) =>
    spec.extensions.includes(extension)
  );

  if (byExtension) {
    return byExtension;
  }

  return (
    SUPPORTED_DOCUMENT_TYPES.find((spec) =>
      spec.mimeTypes.includes(mimeType)
    ) ?? null
  );
}

export function isSupportedFile(
  fileName: string,
  mimeType: string
): boolean {
  return resolveDocumentType(fileName, mimeType) !== null;
}

export const ACCEPTED_EXTENSIONS =
  SUPPORTED_DOCUMENT_TYPES.flatMap((spec) => spec.extensions);

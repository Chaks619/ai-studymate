export function toDocumentResponse(document: any) {
  return {
    id: document._id.toString(),

    workspace: document.workspace?.toString(),

    owner: document.owner?.toString(),

    title: document.title,

    description: document.description,

    extractedText: document.extractedText,

    file: document.file,

    processing: document.processing,

    ai: document.ai,

    tags: document.tags,

    lastOpenedAt: document.lastOpenedAt,

    isArchived: document.isArchived,

    createdAt: document.createdAt,

    updatedAt: document.updatedAt,
  };
}
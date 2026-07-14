export interface PDF {
  id: string;
  name: string;
  url: string;
  uploadedAt: Date;
  summary?: string;
  fileSize: number;
}

export interface PDFUploadResponse {
  id: string;
  name: string;
  url: string;
  uploadedAt: Date;
}

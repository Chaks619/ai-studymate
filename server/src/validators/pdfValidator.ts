import { z } from 'zod';

export const uploadPdfSchema = z.object({
  filename: z.string(),
  mimetype: z.string().includes('pdf'),
  size: z.number().max(10 * 1024 * 1024, 'File size must not exceed 10MB'),
});

export const extractTextSchema = z.object({
  pdfId: z.string().uuid('Invalid PDF ID'),
  startPage: z.number().optional(),
  endPage: z.number().optional(),
});

export type UploadPdfInput = z.infer<typeof uploadPdfSchema>;
export type ExtractTextInput = z.infer<typeof extractTextSchema>;

import { z } from 'zod';

export const createDocumentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  fileUrl: z.string().url('Invalid file URL'),
  fileType: z.enum(['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx', 'xls', 'xlsx', 'image', 'other']),
  fileSize: z.number().positive('File size must be positive'),
  mimeType: z.string(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  isPublic: z.boolean().default(false),
});

export const updateDocumentSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export type CreateDocumentDto = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentDto = z.infer<typeof updateDocumentSchema>;

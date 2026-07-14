import { z } from "zod";

export const uploadDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description is too long")
    .optional(),
});

export type UploadDocumentFormValues =
  z.infer<typeof uploadDocumentSchema>;
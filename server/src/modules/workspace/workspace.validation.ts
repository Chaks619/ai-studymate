import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3)
    .max(100),

  description: z
    .string()
    .trim()
    .max(500)
    .optional(),

  icon: z.string().optional(),
});

export type CreateWorkspaceDto =
  z.infer<typeof createWorkspaceSchema>;
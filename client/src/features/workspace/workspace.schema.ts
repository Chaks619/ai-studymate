import { z } from "zod";

export const workspaceSchema = z.object({
  name: z
    .string()
    .min(2, "Workspace name is required")
    .max(50),

  description: z.string().optional(),

  icon: z.string(),
});

export type WorkspaceFormData =
  z.infer<typeof workspaceSchema>;
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name is required"),

    email: z.string(),

    password: z.string().min(6),

    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type LoginForm = z.infer<typeof loginSchema>;

export type RegisterForm = z.infer<typeof registerSchema>;
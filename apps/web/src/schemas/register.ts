import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(255),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .refine((value) => new TextEncoder().encode(value).length <= 72, "At most 72 bytes long"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

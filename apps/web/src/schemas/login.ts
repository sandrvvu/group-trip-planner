import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
  keepLoggedIn: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

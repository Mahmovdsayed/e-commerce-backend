import { z } from "zod";

export const signUpValidationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "name must be at least 3 characters" })
    .max(20, { message: "name must be at most 20 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email format" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: "Invalid email format",
    }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(30, { message: "Password must be at most 30 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
});

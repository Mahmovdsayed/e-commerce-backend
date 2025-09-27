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

export const signInValidationSchema = z.object({
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

export const updatedUserValidationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: "name must be at least 3 characters" })
    .max(20, { message: "name must be at most 20 characters" })
    .optional(),
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email format" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: "Invalid email format",
    })
    .optional(),

  address: z
    .array(
      z.object({
        label: z.string().optional(),
        street: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
        postalCode: z.string().optional(),
        phone: z.string().optional(),
      })
    )
    .optional(),
});

export const verifyEmailValidationSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email format" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: "Invalid email format",
    }),
  otp: z
    .string()
    .length(6, { message: "OTP must be 6 characters" })
    .regex(/^\d{6}$/, { message: "OTP must be a 6-digit number" }),
});

export const forgotPasswordValidationSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email format" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: "Invalid email format",
    }),
});

export const resetPasswordValidationSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email format" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: "Invalid email format",
    }),
  token: z.string().nonempty({ message: "Token is required" }),
  newPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(30, { message: "Password must be at most 30 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
  confirmPassword: z
    .string()
    .nonempty({ message: "Confirm Password is required" }),
});

export const changePasswordValidationSchema = z.object({
  oldPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(30, { message: "Password must be at most 30 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
  newPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(30, { message: "Password must be at most 30 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
});

export const googleCredentialsValidationSchema = z.object({
  credential: z.string().nonempty({ message: "Credential is required" }),
});

import z from "zod";

export const sendMessageSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(255, { message: "Name must be less than 255 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  subject: z
    .string()
    .min(3, { message: "Subject must be at least 3 characters" })
    .max(255, { message: "Subject must be less than 255 characters" }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must be less than 1000 characters" }),
});

export const sendResponseSchema = z.object({
  response: z
    .string()
    .min(10, { message: "Response must be at least 10 characters" })
    .max(5000, { message: "Response must be less than 5000 characters" }),
});

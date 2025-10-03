import z from "zod";

export const createDiscountSchema = z.object({
  code: z.string().min(1, "Discount code is required"),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().min(0, "Discount value must be a positive number"),
  minCartValue: z
    .number()
    .min(0, "Minimum cart value must be a positive number"),
  expiresAt: z
    .string()
    .refine((dateString) => !isNaN(new Date(dateString).getTime()), {
      message: "Invalid date string for expiresAt",
    }),
  isActive: z.boolean().optional(),
});

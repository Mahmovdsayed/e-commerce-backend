import z from "zod";

export const addCouponSchema = z.object({
  code: z
    .string()
    .min(3, { message: "Code is required and must be at least 3 characters" })
    .max(20, { message: "Code must be less than 20 characters" }),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z
    .number()
    .min(0, { message: "Discount value must be a positive number" }),
  expirationDate: z.string().min(0, { message: "Expiration date is required" }),
  usageLimit: z
    .number()
    .min(0, { message: "Usage limit must be a positive number" }),
  minPurchaseAmount: z
    .number()
    .min(0, { message: "Min purchase amount must be a positive number" }),
  products: z
    .array(z.string())
    .min(1, { message: "At least one product is required" }),
  isActive: z.boolean().default(true),
});

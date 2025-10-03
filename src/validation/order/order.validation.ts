import z from "zod";

export const createCashOrderSchema = z.object({
  shippingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
    postalCode: z.string().min(1),
    phone: z.string().min(1),
  }),
});

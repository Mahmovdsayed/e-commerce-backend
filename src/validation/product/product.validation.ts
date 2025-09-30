import z from "zod";
import allowedExtensions from "../../utils/allowedExtensions.js";

export const addProductSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(255, { message: "Name must be less than 255 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description must be less than 500 characters" }),
  price: z.number().min(0, { message: "Price must be a positive number" }),
  stock: z.number().min(0, { message: "Stock must be a positive number" }),
  categoryId: z.string().min(1, { message: "Category ID is required" }),

  images: z
    .array(
      z
        .any()
        .refine(
          (file) => {
            if (!file) return true;
            const fileName = file.originalname || file.name || "";
            const extension = fileName.split(".").pop()?.toLowerCase();
            return extension && allowedExtensions.image.includes(extension);
          },
          {
            message: "Only image files (jpg, jpeg, png) are allowed",
          }
        )
        .refine(
          (file) => {
            if (!file) return true;
            return file.size <= 5 * 1024 * 1024;
          },
          {
            message: "Image size should be less than 5MB",
          }
        )
    )
    .optional(),
  seo: z
    .object({
      keywords: z.array(z.string()).optional(),
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })
    .optional(),

  purchase_limit: z
    .number()
    .min(0, { message: "Purchase limit must be a positive number" })
    .optional(),
  warranty: z.string().optional(),
  condition: z.string().optional(),
  shipping: z.string().optional(),
  materials: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  dimensions: z
    .object({
      length: z
        .number()
        .min(0, { message: "Length must be a positive number" }),
      width: z.number().min(0, { message: "Width must be a positive number" }),
      height: z
        .number()
        .min(0, { message: "Height must be a positive number" }),
    })
    .optional(),
  options: z
    .array(z.object({ name: z.string(), values: z.array(z.string()) }))
    .optional(),
  attributes: z
    .array(z.object({ name: z.string(), value: z.string() }))
    .optional(),
  colors: z.array(z.object({ name: z.string(), hex: z.string() })).optional(),
  sizes: z.array(z.object({ name: z.string(), value: z.string() })).optional(),
  isActive: z.boolean().optional(),
});

export const updateProductSchema = addProductSchema.partial({
  name: true,
  description: true,
  price: true,
  stock: true,
  categoryId: true,
  seo: true,
  purchase_limit: true,
  isActive: true,
  warranty: true,
  condition: true,
  shipping: true,
  materials: true,
  tags: true,
  dimensions: true,
  options: true,
  attributes: true,
  colors: true,
  sizes: true,
});

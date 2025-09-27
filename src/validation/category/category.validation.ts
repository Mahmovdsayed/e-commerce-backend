import z from "zod";
import allowedExtensions from "../../utils/allowedExtensions.js";

export const addCategorySchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(255, { message: "Name must be less than 255 characters" })
    .trim()
    .toLowerCase(),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description must be less than 500 characters" }),
  metaTitle: z
    .string()
    .min(3, { message: "Meta title must be at least 3 characters" })
    .max(255, { message: "Meta title must be less than 255 characters" })
    .trim()
    .toLowerCase(),
  metaDescription: z
    .string()
    .min(10, { message: "Meta description must be at least 10 characters" })
    .max(500, { message: "Meta description must be less than 500 characters" }),

  image: z
    .any()
    .refine(
      (file) => {
        if (!file) return true;
        const fileName = file?.name || "";
        const extension = fileName.split(".").pop()?.toLowerCase();
        return (
          file instanceof File &&
          extension &&
          allowedExtensions.image.includes(extension)
        );
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
    ),
});

import z from "zod";

export const addReviewSchema = z.object({
  rating: z
    .number()
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating must be at most 5" }),
  comment: z
    .string()
    .min(1, { message: "Comment is required" })
    .max(500, { message: "Comment must be less than 500 characters" }),
});

import { Schema } from "mongoose";

export const SeoSchema = new Schema(
  {
    keywords: [{ type: String }],
    metaTitle: String,
    metaDescription: String,
  },
  { _id: false }
);

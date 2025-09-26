import { Schema, model, Document, Types } from "mongoose";
import imageSchema from "./image.model.js";

export interface ICategory extends Document {
  name: string;
  description?: string;
  image?: typeof imageSchema;
  slug: string;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    slug: { type: String, required: true, unique: true , lowercase: true, trim: true },
    isActive: { type: Boolean, default: true },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    image: imageSchema,
  },
  {
    timestamps: true,
  }
);

export default model<ICategory>("Category", CategorySchema);

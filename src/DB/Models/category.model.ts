import { Schema, model, Document, Types } from "mongoose";
import imageSchema from "./image.model.js";

export interface ICategory extends Document {
  name: string;
  description?: string;
  image?: {
    url: string;
    public_id: string;
  };
  slug: string;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  products: Types.ObjectId[];
  addedBy: Types.ObjectId;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    isActive: { type: Boolean, default: true },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    image: imageSchema,
    products: [{ type: Schema.Types.ObjectId, ref: "Product", index: true }],
    addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export default model<ICategory>("Category", CategorySchema);

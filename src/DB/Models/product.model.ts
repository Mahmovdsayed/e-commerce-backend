import { Schema, model, Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  category: string;
  images: string[];
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
  categoryId: Types.ObjectId;  
  slug: string;

}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    sku: { type: String, required: true, unique: true , uppercase: true, trim: true },
    stock: { type: Number, default: 0 },
    category: { type: String },
    images: [String],
    isActive: { type: Boolean, default: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    slug: { type: String, required: true, unique: true , lowercase: true, trim: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  },
  { timestamps: true }
);

export default model<IProduct>("Product", ProductSchema);

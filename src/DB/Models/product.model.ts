import { Schema, model, Document, Types } from "mongoose";
import imageSchema from "./image.model.js";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  category: string;
  images: [{ url: string; public_id: string }];
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
  categoryId: Types.ObjectId;
  slug: string;
  reviews: any;
  addedBy: Types.ObjectId;
  hasCoupon: boolean;
  couponId?: Types.ObjectId;
  purchase_limit: number;
  options: {
    name: string;
    values: string[];
  }[];
  attributes: {
    name: string;
    value: string;
  }[];
  colors: {
    name: string;
    hex: string;
  }[];
  sizes: {
    name: string;
    value: string;
  }[];
  tags: string[];
  warranty: string;
  condition: string;
  shipping: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  materials: string[];
  rating: number;
  numReviews: number;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    stock: { type: Number, default: 0 },
    category: { type: String },
    images: [imageSchema],
    isActive: { type: Boolean, default: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    purchase_limit: { type: Number, default: 0 },
    warranty: { type: String },
    condition: { type: String },
    shipping: { type: String },
    materials: [{ type: String }],
    hasCoupon: { type: Boolean, default: false },
    couponId: { type: Schema.Types.ObjectId, ref: "Coupon" },
    tags: [{ type: String }],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    options: [
      {
        name: { type: String, required: true },
        values: [{ type: String, required: true }],
      },
    ],
    attributes: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    colors: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true },
      },
    ],
    sizes: [
      {
        name: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default model<IProduct>("Product", ProductSchema);

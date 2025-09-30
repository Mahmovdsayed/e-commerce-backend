import { Schema, model, Document, Types } from "mongoose";
import imageSchema from "./image.model.js";
import { OptionSchema } from "./subSchemas/option.schema.js";
import { AttributeSchema } from "./subSchemas/attribute.schema.js";
import { ColorSchema } from "./subSchemas/color.schema.js";
import { SizeSchema } from "./subSchemas/size.schema.js";
import { DimensionSchema } from "./subSchemas/dimension.schema.js";
import { SeoSchema } from "./subSchemas/seo.schema.js";
import { slugifyText } from "../../helpers/slugify.js";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  categoryId: Types.ObjectId;
  images: { url: string; public_id: string }[];
  isActive: boolean;
  seo: {
    keywords: string[];
    metaTitle: string;
    metaDescription: string;
  };
  purchase_limit: number;
  warranty?: string;
  condition?: string;
  shipping?: string;
  materials: string[];
  couponId?: Types.ObjectId;
  tags: string[];
  dimensions: { length: number; width: number; height: number };
  slug: string;
  reviews: Types.ObjectId[];
  addedBy: Types.ObjectId;
  options: { name: string; values: string[] }[];
  attributes: { name: string; value: string }[];
  colors: { name: string; hex: string }[];
  sizes: { name: string; value: string }[];
  createdAt: Date;
  updatedAt: Date;
  numReviews: number;
  rating: number;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    sku: {
      type: String,
      unique: true,
    },
    stock: { type: Number, default: 0 },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [imageSchema],
    isActive: { type: Boolean, default: true },
    seo: SeoSchema,
    purchase_limit: { type: Number, default: 0 },
    warranty: String,
    condition: String,
    shipping: String,
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    materials: [String],
    tags: [String],
    dimensions: DimensionSchema,
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    options: [OptionSchema],
    attributes: [AttributeSchema],
    colors: [ColorSchema],
    sizes: [SizeSchema],
  },
  { timestamps: true }
);

ProductSchema.index({ categoryId: 1, price: 1, stock: 1, isActive: 1 });

ProductSchema.index({ tags: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ attributes: 1, options: 1 });

ProductSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugifyText(this.name);
  }
  next();
});

ProductSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as any;
  if (update?.name) {
    update.slug = slugifyText(update.name);
  }
  next();
});

ProductSchema.pre("save", function (next) {
  if (!this.sku) {
    const prefix = this.name ? this.name.substring(0, 3).toUpperCase() : "PRD";

    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.floor(1000 + Math.random() * 9000);

    this.sku = `${prefix}-${datePart}-${randomPart}`;
  }
  next();
});

ProductSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as any;
  if (update && update.name && !update.sku) {
    const prefix = update.name
      ? update.name.substring(0, 3).toUpperCase()
      : "PRD";
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    update.sku = `${prefix}-${datePart}-${randomPart}`;
  }
  next();
});

export default model<IProduct>("Product", ProductSchema);

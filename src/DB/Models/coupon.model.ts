import { Schema, model, Document, Types } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  expirationDate: Date;
  usageLimit?: number;
  usedCount: number;
  minPurchaseAmount?: number;
  isActive: boolean;
  products: Types.ObjectId[];
  users: Types.ObjectId[];
  addedBy: Types.ObjectId;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, trim: true },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: { type: Number, required: true, min: 0 },
    expirationDate: { type: Date, required: true },
    usageLimit: { type: Number, min: 0 },
    usedCount: { type: Number, default: 0 },
    minPurchaseAmount: { type: Number, min: 0 },
    isActive: { type: Boolean, default: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

CouponSchema.index({ code: 1 }, { unique: true });
CouponSchema.index({ isActive: 1, expirationDate: 1 });
CouponSchema.index({ expirationDate: 1 });

export default model<ICoupon>("Coupon", CouponSchema);

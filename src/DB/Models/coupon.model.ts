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
  },
  { timestamps: true }
);

export default model<ICoupon>("Coupon", CouponSchema);

import { Schema, model, Document } from "mongoose";

export interface IDiscount extends Document {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minCartValue: number;
  expiresAt: Date;
  isActive: boolean;
  addedBy: Schema.Types.ObjectId;
}

const discountSchema = new Schema<IDiscount>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: { type: Number, required: true },
    minCartValue: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model<IDiscount>("Discount", discountSchema);

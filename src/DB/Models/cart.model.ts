import { Schema, model, Document, Types } from "mongoose";

export interface ICart extends Document {
  userId: Types.ObjectId;
  cartItems: {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  totalPriceAfterDiscount: number;
  discount: number;
  appliedDiscountCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    cartItems: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, default: 0 },
    appliedDiscountCode: { type: String, default: null },
    discount: { type: Number, default: 0 },
    totalPriceAfterDiscount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CartSchema.index({ userId: 1 });
CartSchema.index({ createdAt: -1 });

export default model<ICart>("Cart", CartSchema);

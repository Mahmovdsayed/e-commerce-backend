import { Schema, model, Document, Types } from "mongoose";

export interface IOrder extends Document {
  userId: Types.ObjectId;
  items: {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded";
  paymentId?: string;
  shippingAddress: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
    phone: string;
  };
  shippingStatus: "pending" | "in_transit" | "delivered";
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    paymentId: { type: String },
    shippingAddress: {
      street: String,
      city: String,
      country: String,
      postalCode: String,
      phone: String,
    },
    shippingStatus: {
      type: String,
      enum: ["pending", "in_transit", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default model<IOrder>("Order", OrderSchema);

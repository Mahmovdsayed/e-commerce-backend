import { Schema, model, Document, Types } from "mongoose";

export interface IPayment extends Document {
  orderId: Types.ObjectId;
  userId: Types.ObjectId;
  provider: "stripe" | "paymob";
  transactionId: string;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed";
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    provider: {
      type: String,
      enum: ["stripe"],
      default: "stripe",
      required: true,
    },
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default model<IPayment>("Payment", PaymentSchema);

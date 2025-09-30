import { Schema, model, Document, Types } from "mongoose";

export interface ICart extends Document {
  userId: Types.ObjectId;
  items: {
    productId: Types.ObjectId;
    quantity: number;
  }[];
  totalAmount: number;
}

const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1, default: 1 },
      },
    ],
    totalAmount: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

CartSchema.index({ userId: 1 });
CartSchema.index({ createdAt: -1 });

CartSchema.pre("save", async function (next) {
  if (this.isModified("items")) {
    let total = 0;
    for (const item of this.items) {
      const product = await model("Product").findById(item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
    }
    this.totalAmount = total;
  }
  next();
});

CartSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;
  if (update && update.items) {
    let total = 0;
    for (const item of update.items) {
      const product = await model("Product").findById(item.productId);
      if (product) {
        total += product.price * item.quantity;
      }
    }
    update.totalAmount = total;
    this.setUpdate(update);
  }
  next();
});

export default model<ICart>("Cart", CartSchema);

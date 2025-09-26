import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  address?: [
    {
      label: string;
      street: string;
      city: string;
      country: string;
      postalCode: string;
      phone: string;
    }
  ];
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    address: [
      {
        label: { type: String },
        street: { type: String },
        city: { type: String },
        country: { type: String },
        postalCode: { type: String },
        phone: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;

import mongoose, { Schema, Document, Model } from "mongoose";
import imageSchema from "./image.model.js";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image: typeof imageSchema;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: imageSchema,
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;

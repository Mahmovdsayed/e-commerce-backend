import { Schema } from "mongoose";

export const OptionSchema = new Schema(
  {
    name: { type: String, required: true },
    values: [{ type: String, required: true }],
  },
  { _id: false }
);

import { Schema } from "mongoose";

const imageSchema = new Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: false },
  },
  { timestamps: true }
);

export default imageSchema;

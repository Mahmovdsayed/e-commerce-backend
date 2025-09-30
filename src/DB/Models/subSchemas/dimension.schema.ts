import { Schema } from "mongoose";

export const DimensionSchema = new Schema(
  {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
  },
  { _id: false }
);

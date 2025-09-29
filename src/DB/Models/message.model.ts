import { Schema, model, Document, Types } from "mongoose";

export interface IMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "read" | "unread";
  response?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["read", "unread"], default: "unread" },
    response: { type: String },
  },
  { timestamps: true }
);

MessageSchema.index({ email: 1 });
MessageSchema.index({ createdAt: -1 });

export default model<IMessage>("Message", MessageSchema);

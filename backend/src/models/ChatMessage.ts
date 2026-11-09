import mongoose, { Document, Schema } from "mongoose";

export interface IChatMessage extends Document {
  senderName: string;
  senderRole: string;
  senderDepartment: string;
  senderInitials: string;
  senderEmail: string;
  targetId: string;
  targetType: "channel" | "direct";
  content: string;
  timestamp: string;
  createdAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    senderName: { type: String, required: true },
    senderRole: { type: String, required: true },
    senderDepartment: { type: String, default: "Dealership HQ" },
    senderInitials: { type: String, default: "ST" },
    senderEmail: { type: String, required: true },
    targetId: { type: String, required: true, index: true },
    targetType: { type: String, enum: ["channel", "direct"], required: true },
    content: { type: String, required: true },
    timestamp: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const ChatMessage = mongoose.model<IChatMessage>("ChatMessage", chatMessageSchema);


import mongoose, { Document, Schema } from "mongoose";

export interface IMasterData extends Document {
  category: string;
  code: string;
  label: string;
  value: string;
  description?: string;
  department: string;
  isActive: boolean;
  orderIndex: number;
  metadata?: Record<string, any>;
  createdBy?: mongoose.Types.ObjectId;
}

const masterDataSchema = new Schema<IMasterData>(
  {
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
    },
    code: {
      type: String,
      required: [true, "Code identifier is required"],
      trim: true,
      uppercase: true,
    },
    label: {
      type: String,
      required: [true, "Label is required"],
      trim: true,
    },
    value: {
      type: String,
      required: [true, "Value is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    department: {
      type: String,
      required: true,
      default: "general",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    orderIndex: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index so each category has unique codes
masterDataSchema.index({ category: 1, code: 1 }, { unique: true });

export const MasterData = mongoose.model<IMasterData>("MasterData", masterDataSchema);


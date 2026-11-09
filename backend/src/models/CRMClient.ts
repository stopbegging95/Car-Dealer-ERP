import mongoose, { Document, Schema } from "mongoose";

export interface ICRMClient extends Document {
  clientId: string;
  userId?: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  companyName?: string;
  tier: "Standard" | "Gold Member" | "Platinum VIP" | "Presidential HNWI";
  totalPurchasesCount: number;
  lifetimeSpendNGN: number;
  preferredBrands: string[];
  relationshipManagerName: string;

  inquiries: {
    date: Date;
    subject: string;
    vehicleInterest?: string;
    status: "Open" | "Contacted" | "Closed";
    notes?: string;
  }[];

  complaints: {
    ticketId: string;
    subject: string;
    priority: "Low" | "Medium" | "Urgent";
    status: "Open" | "Investigating" | "Resolved";
    resolutionNotes?: string;
    createdAt: Date;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

const crmClientSchema = new Schema<ICRMClient>(
  {
    clientId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      default: "",
    },
    tier: {
      type: String,
      enum: ["Standard", "Gold Member", "Platinum VIP", "Presidential HNWI"],
      default: "Standard",
      index: true,
    },
    totalPurchasesCount: {
      type: Number,
      default: 0,
    },
    lifetimeSpendNGN: {
      type: Number,
      default: 0,
    },
    preferredBrands: {
      type: [String],
      default: ["Mercedes-Benz", "Land Rover"],
    },
    relationshipManagerName: {
      type: String,
      default: "VIP Private Client Executive",
    },

    inquiries: [
      {
        date: { type: Date, default: Date.now },
        subject: String,
        vehicleInterest: String,
        status: { type: String, enum: ["Open", "Contacted", "Closed"], default: "Open" },
        notes: String,
      },
    ],

    complaints: [
      {
        ticketId: String,
        subject: String,
        priority: { type: String, enum: ["Low", "Medium", "Urgent"], default: "Medium" },
        status: { type: String, enum: ["Open", "Investigating", "Resolved"], default: "Open" },
        resolutionNotes: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const CRMClient = mongoose.model<ICRMClient>("CRMClient", crmClientSchema);


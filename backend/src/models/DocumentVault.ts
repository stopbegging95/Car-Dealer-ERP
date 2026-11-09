import mongoose, { Document, Schema } from "mongoose";

export interface IDocumentVault extends Document {
  docId: string;
  title: string;
  category:
    | "Vehicle Customs Single Goods Declaration (SGD)"
    | "Original Title / Bill of Sale"
    | "FIRS Tax Clearance Certificate"
    | "Dealership Corporate License"
    | "Vendor Consignment Contract"
    | "Hire Purchase Agreement"
    | "Police Anti-Theft Clearance";

  relatedEntityId?: string; // VIN or Order Number or Staff ID
  fileUrl: string;
  fileSizeMb?: number;
  mimeType?: string;

  issueDate: Date;
  expiryDate?: Date;
  verifiedBy?: string;
  verificationStatus: "Valid & Verified" | "Expiring Soon" | "Expired" | "Action Required";
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const documentVaultSchema = new Schema<IDocumentVault>(
  {
    docId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Vehicle Customs Single Goods Declaration (SGD)",
        "Original Title / Bill of Sale",
        "FIRS Tax Clearance Certificate",
        "Dealership Corporate License",
        "Vendor Consignment Contract",
        "Hire Purchase Agreement",
        "Police Anti-Theft Clearance",
      ],
      default: "Vehicle Customs Single Goods Declaration (SGD)",
      index: true,
    },
    relatedEntityId: {
      type: String,
      default: "",
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSizeMb: {
      type: Number,
      default: 1.5,
    },
    mimeType: {
      type: String,
      default: "application/pdf",
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: Date,
    verifiedBy: {
      type: String,
      default: "Legal & Compliance Officer",
    },
    verificationStatus: {
      type: String,
      enum: ["Valid & Verified", "Expiring Soon", "Expired", "Action Required"],
      default: "Valid & Verified",
      index: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const DocumentVault = mongoose.model<IDocumentVault>("DocumentVault", documentVaultSchema);


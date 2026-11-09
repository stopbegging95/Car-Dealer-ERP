import mongoose, { Document, Schema } from "mongoose";

export interface IBranchTransfer extends Document {
  transferId: string;
  waybillNumber: string;
  vehicleId: mongoose.Types.ObjectId;
  vin: string;
  vehicleSummary: string;

  sourceHub: string;
  destinationHub: string;
  carrierDriverName: string;
  carrierDriverPhone: string;
  truckPlateNumber: string;

  departureTime: Date;
  estimatedArrivalTime: Date;
  actualArrivalTime?: Date;

  status: "Dispatch Scheduled" | "In Transit" | "Delivered & Received" | "Flagged Discrepancy";
  dispatchSignoffBy: string;
  receivingSignoffBy?: string;
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const branchTransferSchema = new Schema<IBranchTransfer>(
  {
    transferId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    waybillNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    vin: {
      type: String,
      required: true,
      uppercase: true,
    },
    vehicleSummary: {
      type: String,
      required: true,
    },
    sourceHub: {
      type: String,
      required: true,
      default: "Victoria Island HQ, Lagos",
    },
    destinationHub: {
      type: String,
      required: true,
      default: "Abuja Maitama Showcase",
    },
    carrierDriverName: {
      type: String,
      required: true,
    },
    carrierDriverPhone: {
      type: String,
      required: true,
    },
    truckPlateNumber: {
      type: String,
      required: true,
    },
    departureTime: {
      type: Date,
      default: Date.now,
    },
    estimatedArrivalTime: {
      type: Date,
      required: true,
    },
    actualArrivalTime: Date,
    status: {
      type: String,
      enum: ["Dispatch Scheduled", "In Transit", "Delivered & Received", "Flagged Discrepancy"],
      default: "Dispatch Scheduled",
      index: true,
    },
    dispatchSignoffBy: {
      type: String,
      default: "Logistics Controller",
    },
    receivingSignoffBy: {
      type: String,
      default: "",
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

export const BranchTransfer = mongoose.model<IBranchTransfer>("BranchTransfer", branchTransferSchema);


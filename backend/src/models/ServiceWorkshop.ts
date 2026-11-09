import mongoose, { Document, Schema } from "mongoose";

export interface IWorkshopPartUsed {
  partId?: mongoose.Types.ObjectId;
  partName: string;
  partSku: string;
  quantity: number;
  unitCostNGN: number;
  totalCostNGN: number;
}

export interface IServiceWorkshop extends Document {
  jobCardNumber: string;
  vehicleId: mongoose.Types.ObjectId;
  vin: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;

  assignedMechanicId?: mongoose.Types.ObjectId;
  assignedMechanicName: string;
  bayNumber: string;

  serviceCategory: "Periodic Maintenance" | "Braking System" | "Engine Overhaul" | "Transmission Service" | "Air Conditioning" | "Electrical & Diagnostics";
  symptomsReported: string[];
  diagnosticFindings: string;

  status:
    | "Queued"
    | "In Diagnostics"
    | "Awaiting Parts"
    | "In Repair"
    | "Road Test QA"
    | "Completed"
    | "Invoiced & Released";

  partsUsed: IWorkshopPartUsed[];
  laborHours: number;
  laborRatePerHourNGN: number;
  totalLaborCostNGN: number;
  totalPartsCostNGN: number;
  statutoryVatNGN: number;
  totalAmountNGN: number;

  intakeDate: Date;
  estimatedCompletionDate?: Date;
  actualCompletionDate?: Date;
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const serviceWorkshopSchema = new Schema<IServiceWorkshop>(
  {
    jobCardNumber: {
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
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      default: "",
    },
    assignedMechanicId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    assignedMechanicName: {
      type: String,
      default: "Lead Master Technician",
    },
    bayNumber: {
      type: String,
      required: true,
      default: "Bay 01 - Diagnostics",
    },
    serviceCategory: {
      type: String,
      required: true,
      enum: [
        "Periodic Maintenance",
        "Braking System",
        "Engine Overhaul",
        "Transmission Service",
        "Air Conditioning",
        "Electrical & Diagnostics",
      ],
      default: "Periodic Maintenance",
    },
    symptomsReported: {
      type: [String],
      default: [],
    },
    diagnosticFindings: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: [
        "Queued",
        "In Diagnostics",
        "Awaiting Parts",
        "In Repair",
        "Road Test QA",
        "Completed",
        "Invoiced & Released",
      ],
      default: "Queued",
      index: true,
    },

    partsUsed: [
      {
        partId: { type: Schema.Types.ObjectId, ref: "PartsInventory" },
        partName: String,
        partSku: String,
        quantity: Number,
        unitCostNGN: Number,
        totalCostNGN: Number,
      },
    ],
    laborHours: {
      type: Number,
      default: 0,
    },
    laborRatePerHourNGN: {
      type: Number,
      default: 25000, // ₦25,000/hr
    },
    totalLaborCostNGN: {
      type: Number,
      default: 0,
    },
    totalPartsCostNGN: {
      type: Number,
      default: 0,
    },
    statutoryVatNGN: {
      type: Number,
      default: 0,
    },
    totalAmountNGN: {
      type: Number,
      default: 0,
    },

    intakeDate: {
      type: Date,
      default: Date.now,
    },
    estimatedCompletionDate: Date,
    actualCompletionDate: Date,
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Calculation of workshop totals
serviceWorkshopSchema.pre("save", function (next) {
  this.totalLaborCostNGN = (this.laborHours || 0) * (this.laborRatePerHourNGN || 0);
  this.totalPartsCostNGN = (this.partsUsed || []).reduce(
    (acc, curr) => acc + (curr.totalCostNGN || (curr.quantity * curr.unitCostNGN) || 0),
    0
  );
  const subtotal = this.totalLaborCostNGN + this.totalPartsCostNGN;
  this.statutoryVatNGN = Math.round(subtotal * 0.075);
  this.totalAmountNGN = subtotal + this.statutoryVatNGN;
  next();
});

export const ServiceWorkshop = mongoose.model<IServiceWorkshop>("ServiceWorkshop", serviceWorkshopSchema);


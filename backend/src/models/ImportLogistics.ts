import mongoose, { Document, Schema } from "mongoose";

export interface IImportLogistics extends Document {
  shipmentId: string;
  trackingNumber: string;
  vesselName: string;
  voyageNumber: string;
  bolNumber: string;
  containerNumber: string;
  vinList: string[];

  originPort: string;
  destinationPort: "Apapa Port Lagos" | "Tin Can Island Port (TCIT)" | "Onne Port Port Harcourt";
  shippingLine: string;
  clearingAgentName: string;
  clearingAgentPhone: string;

  customsSGDNumber: string;
  customsDutyPaidNGN: number;
  terminalChargesNGN: number;
  shippingCompanyChargesNGN: number;
  demurrageDaysCount: number;
  demurrageAccruedNGN: number;

  departureDate: Date;
  etaPortDate: Date;
  actualArrivalDate?: Date;
  gateExitDate?: Date;

  clearingStatus:
    | "At Sea"
    | "Vessel Berthed"
    | "Customs PAAR Verification"
    | "Physical Examination"
    | "Duty Assessed & Paid"
    | "Exit Gate Pass Issued"
    | "En-Route to Central Depot"
    | "Received & Discharged at HQ";

  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const importLogisticsSchema = new Schema<IImportLogistics>(
  {
    shipmentId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    vesselName: {
      type: String,
      required: true,
    },
    voyageNumber: {
      type: String,
      required: true,
    },
    bolNumber: {
      type: String,
      required: true,
      index: true,
    },
    containerNumber: {
      type: String,
      required: true,
    },
    vinList: {
      type: [String],
      default: [],
    },
    originPort: {
      type: String,
      default: "Port of Newark / New York, USA",
    },
    destinationPort: {
      type: String,
      enum: [
        "Apapa Port Lagos",
        "Tin Can Island Port (TCIT)",
        "Onne Port Port Harcourt",
      ],
      default: "Tin Can Island Port (TCIT)",
      index: true,
    },
    shippingLine: {
      type: String,
      default: "Grimaldi Lines / MSC",
    },
    clearingAgentName: {
      type: String,
      default: "Prestige Maritime Freight & Logistics",
    },
    clearingAgentPhone: {
      type: String,
      default: "+234 803 555 0192",
    },

    customsSGDNumber: {
      type: String,
      default: "",
    },
    customsDutyPaidNGN: {
      type: Number,
      default: 0,
    },
    terminalChargesNGN: {
      type: Number,
      default: 0,
    },
    shippingCompanyChargesNGN: {
      type: Number,
      default: 0,
    },
    demurrageDaysCount: {
      type: Number,
      default: 0,
    },
    demurrageAccruedNGN: {
      type: Number,
      default: 0,
    },

    departureDate: {
      type: Date,
      required: true,
    },
    etaPortDate: {
      type: Date,
      required: true,
    },
    actualArrivalDate: Date,
    gateExitDate: Date,

    clearingStatus: {
      type: String,
      enum: [
        "At Sea",
        "Vessel Berthed",
        "Customs PAAR Verification",
        "Physical Examination",
        "Duty Assessed & Paid",
        "Exit Gate Pass Issued",
        "En-Route to Central Depot",
        "Received & Discharged at HQ",
      ],
      default: "At Sea",
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

export const ImportLogistics = mongoose.model<IImportLogistics>("ImportLogistics", importLogisticsSchema);


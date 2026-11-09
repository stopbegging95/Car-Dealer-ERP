import mongoose, { Document, Schema } from "mongoose";

export interface ITradeInSwap extends Document {
  tradeInId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;

  offeredVehicle: {
    vin?: string;
    make: string;
    modelName: string;
    year: number;
    mileageKm: number;
    condition: "Foreign Used (Tokunbo)" | "Nigerian Used (Clean)" | "Needs Light Repairs";
    estimatedMarketValueNGN: number;
    appraisalOfferNGN: number;
  };

  desiredVehicleId?: mongoose.Types.ObjectId;
  desiredVehicleSummary?: {
    vin: string;
    make: string;
    modelName: string;
    year: number;
    priceNGN: number;
  };

  swapDifferentialNGN: number;
  status:
    | "Initial Submission"
    | "Physical Inspection Scheduled"
    | "Valuation Approved"
    | "Offer Accepted by Client"
    | "Swap Contract Signed"
    | "Completed - Transferred to Recon"
    | "Declined";

  inspectionDate?: Date;
  appraiserName?: string;
  appraisalNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const tradeInSwapSchema = new Schema<ITradeInSwap>(
  {
    tradeInId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
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
      required: true,
      lowercase: true,
    },

    offeredVehicle: {
      vin: String,
      make: { type: String, required: true },
      modelName: { type: String, required: true },
      year: { type: Number, required: true },
      mileageKm: { type: Number, required: true },
      condition: {
        type: String,
        enum: ["Foreign Used (Tokunbo)", "Nigerian Used (Clean)", "Needs Light Repairs"],
        default: "Nigerian Used (Clean)",
      },
      estimatedMarketValueNGN: { type: Number, default: 0 },
      appraisalOfferNGN: { type: Number, default: 0 },
    },

    desiredVehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    desiredVehicleSummary: {
      vin: String,
      make: String,
      modelName: String,
      year: Number,
      priceNGN: Number,
    },

    swapDifferentialNGN: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: [
        "Initial Submission",
        "Physical Inspection Scheduled",
        "Valuation Approved",
        "Offer Accepted by Client",
        "Swap Contract Signed",
        "Completed - Transferred to Recon",
        "Declined",
      ],
      default: "Initial Submission",
      index: true,
    },

    inspectionDate: Date,
    appraiserName: {
      type: String,
      default: "Lead Vehicle Appraiser",
    },
    appraisalNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

tradeInSwapSchema.pre("save", function (next) {
  const desiredPrice = this.desiredVehicleSummary?.priceNGN || 0;
  const offer = this.offeredVehicle?.appraisalOfferNGN || 0;
  this.swapDifferentialNGN = Math.max(0, desiredPrice - offer);
  next();
});

export const TradeInSwap = mongoose.model<ITradeInSwap>("TradeInSwap", tradeInSwapSchema);


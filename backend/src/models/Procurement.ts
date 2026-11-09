import mongoose, { Document, Schema } from "mongoose";

export interface IProcurement extends Document {
  poNumber: string;
  vin: string;
  make: string;
  modelName: string;
  year: number;
  countryOfOrigin: string;

  supplierName: string;
  supplierContact: string;
  purchasingMethod:
    | "Copart US Auction"
    | "Manheim US Auction"
    | "Direct OEM Factory Order"
    | "Local Consignment Dealer"
    | "Dubai Jebel Ali Export Hub"
    | "European Fleet Source";

  purchasePriceForeign: number;
  foreignCurrency: "USD" | "EUR" | "GBP" | "AED";
  exchangeRateNGN: number;
  purchasePriceNGN: number;

  auctionFeesNGN: number;
  shippingFreightNGN: number;
  terminalHandlingNGN: number;
  estimatedCustomsNGN: number;
  totalEstimatedLandedCostNGN: number;

  approvalStatus:
    | "Draft Sourcing"
    | "Pending Executive Approval"
    | "Approved (>₦150M Signoff)"
    | "Rejected"
    | "PO Dispatched to Supplier"
    | "Vehicle In-Transit to Port"
    | "Arrived & Transferred to Stock";

  requiresHighValueApproval: boolean;
  executiveSignoffBy?: mongoose.Types.ObjectId;
  executiveSignoffDate?: Date;
  executiveRemarks?: string;

  paymentTerms: string;
  etaPortDate?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const procurementSchema = new Schema<IProcurement>(
  {
    poNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    vin: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    make: {
      type: String,
      required: true,
    },
    modelName: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    countryOfOrigin: {
      type: String,
      default: "United States",
    },

    supplierName: {
      type: String,
      required: true,
    },
    supplierContact: {
      type: String,
      default: "",
    },
    purchasingMethod: {
      type: String,
      required: true,
      enum: [
        "Copart US Auction",
        "Manheim US Auction",
        "Direct OEM Factory Order",
        "Local Consignment Dealer",
        "Dubai Jebel Ali Export Hub",
        "European Fleet Source",
      ],
      default: "Copart US Auction",
    },

    purchasePriceForeign: {
      type: Number,
      required: true,
      default: 0,
    },
    foreignCurrency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "AED"],
      default: "USD",
    },
    exchangeRateNGN: {
      type: Number,
      required: true,
      default: 1550,
    },
    purchasePriceNGN: {
      type: Number,
      required: true,
      default: 0,
    },

    auctionFeesNGN: {
      type: Number,
      default: 0,
    },
    shippingFreightNGN: {
      type: Number,
      default: 0,
    },
    terminalHandlingNGN: {
      type: Number,
      default: 0,
    },
    estimatedCustomsNGN: {
      type: Number,
      default: 0,
    },
    totalEstimatedLandedCostNGN: {
      type: Number,
      default: 0,
    },

    approvalStatus: {
      type: String,
      enum: [
        "Draft Sourcing",
        "Pending Executive Approval",
        "Approved (>₦150M Signoff)",
        "Rejected",
        "PO Dispatched to Supplier",
        "Vehicle In-Transit to Port",
        "Arrived & Transferred to Stock",
      ],
      default: "Draft Sourcing",
      index: true,
    },

    requiresHighValueApproval: {
      type: Boolean,
      default: false,
    },
    executiveSignoffBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    executiveSignoffDate: Date,
    executiveRemarks: String,

    paymentTerms: {
      type: String,
      default: "Irrevocable Letter of Credit (L/C) 30 Days",
    },
    etaPortDate: Date,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save calculation & high-value gate check (>₦150,000,000 requires executive approval)
procurementSchema.pre("save", function (next) {
  if (this.purchasePriceForeign > 0 && this.exchangeRateNGN > 0) {
    this.purchasePriceNGN = this.purchasePriceForeign * this.exchangeRateNGN;
  }
  this.totalEstimatedLandedCostNGN =
    this.purchasePriceNGN +
    (this.auctionFeesNGN || 0) +
    (this.shippingFreightNGN || 0) +
    (this.terminalHandlingNGN || 0) +
    (this.estimatedCustomsNGN || 0);

  if (this.totalEstimatedLandedCostNGN >= 150000000) {
    this.requiresHighValueApproval = true;
  } else {
    this.requiresHighValueApproval = false;
  }
  next();
});

export const Procurement = mongoose.model<IProcurement>("Procurement", procurementSchema);


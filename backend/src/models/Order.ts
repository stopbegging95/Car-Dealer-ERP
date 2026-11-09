import mongoose, { Document, Schema } from "mongoose";

export interface IOrderTransaction {
  reference: string;
  amountNGN: number;
  date: Date;
  method: "Bank Wire / NIBSS" | "Paystack Online Card" | "Automotive Financing" | "Trade-In Swap Differential" | "Bank Draft";
  status: "Pending" | "Success" | "Failed";
  channel?: string;
  notes?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customerId?: mongoose.Types.ObjectId;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;

  vehicleId: mongoose.Types.ObjectId;
  vehicleSummary: {
    vin: string;
    stockId: string;
    make: string;
    modelName: string;
    year: number;
    listingPriceNGN: number;
  };

  salesRepId?: mongoose.Types.ObjectId;
  salesRepName: string;

  // Financial Breakdown in NGN
  vehiclePriceNGN: number;
  statutoryVatNGN: number;
  registrationFeesNGN: number;
  accessoriesTotalNGN: number;
  discountAmountNGN: number;
  totalAmountNGN: number;
  depositAmountNGN: number;
  balanceDueNGN: number;

  paymentStatus: "Pending" | "Partially Paid" | "Fully Paid" | "Overdue" | "Refunded";
  paymentMethod: "Bank Wire / NIBSS" | "Paystack Online Card" | "Automotive Financing" | "Trade-In Swap Differential" | "Bank Draft";
  paystackReference?: string;
  transactions: IOrderTransaction[];

  stage:
    | "Draft Quote"
    | "Offer Pending"
    | "Contract Signed"
    | "Deposit Cleared"
    | "Financing Approved"
    | "PDI Inspection Passed"
    | "Allocation Assigned"
    | "Ready for Handover"
    | "Delivered & Closed"
    | "Cancelled";

  deliveryDetails: {
    hubLocation: string;
    scheduledDeliveryDate?: Date;
    actualDeliveryDate?: Date;
    recipientName?: string;
    recipientPhone?: string;
    handoverNotes?: string;
  };

  discountApprovedBy?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, "Customer email is required"],
      lowercase: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: [true, "Customer phone is required"],
    },
    customerAddress: {
      type: String,
      default: "",
    },
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
      index: true,
    },
    vehicleSummary: {
      vin: String,
      stockId: String,
      make: String,
      modelName: String,
      year: Number,
      listingPriceNGN: Number,
    },
    salesRepId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    salesRepName: {
      type: String,
      default: "Executive Sales Desk",
    },

    // Financials
    vehiclePriceNGN: {
      type: Number,
      required: true,
    },
    statutoryVatNGN: {
      type: Number,
      default: 0,
    },
    registrationFeesNGN: {
      type: Number,
      default: 0,
    },
    accessoriesTotalNGN: {
      type: Number,
      default: 0,
    },
    discountAmountNGN: {
      type: Number,
      default: 0,
    },
    totalAmountNGN: {
      type: Number,
      required: true,
    },
    depositAmountNGN: {
      type: Number,
      default: 0,
    },
    balanceDueNGN: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Partially Paid", "Fully Paid", "Overdue", "Refunded"],
      default: "Pending",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: [
        "Bank Wire / NIBSS",
        "Paystack Online Card",
        "Automotive Financing",
        "Trade-In Swap Differential",
        "Bank Draft",
      ],
      default: "Bank Wire / NIBSS",
    },
    paystackReference: {
      type: String,
      default: "",
    },
    transactions: [
      {
        reference: String,
        amountNGN: Number,
        date: { type: Date, default: Date.now },
        method: String,
        status: { type: String, default: "Pending" },
        channel: String,
        notes: String,
      },
    ],

    stage: {
      type: String,
      enum: [
        "Draft Quote",
        "Offer Pending",
        "Contract Signed",
        "Deposit Cleared",
        "Financing Approved",
        "PDI Inspection Passed",
        "Allocation Assigned",
        "Ready for Handover",
        "Delivered & Closed",
        "Cancelled",
      ],
      default: "Draft Quote",
      index: true,
    },

    deliveryDetails: {
      hubLocation: { type: String, default: "Victoria Island HQ, Lagos" },
      scheduledDeliveryDate: Date,
      actualDeliveryDate: Date,
      recipientName: String,
      recipientPhone: String,
      handoverNotes: String,
    },

    discountApprovedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
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

// Pre-save recalculation
orderSchema.pre("save", function (next) {
  this.statutoryVatNGN = Math.round((this.vehiclePriceNGN || 0) * 0.075);
  this.totalAmountNGN =
    (this.vehiclePriceNGN || 0) +
    this.statutoryVatNGN +
    (this.registrationFeesNGN || 0) +
    (this.accessoriesTotalNGN || 0) -
    (this.discountAmountNGN || 0);

  this.balanceDueNGN = Math.max(0, this.totalAmountNGN - (this.depositAmountNGN || 0));
  if (this.balanceDueNGN === 0 && this.depositAmountNGN > 0) {
    this.paymentStatus = "Fully Paid";
  } else if (this.depositAmountNGN > 0 && this.balanceDueNGN > 0) {
    this.paymentStatus = "Partially Paid";
  }
  next();
});

export const Order = mongoose.model<IOrder>("Order", orderSchema);


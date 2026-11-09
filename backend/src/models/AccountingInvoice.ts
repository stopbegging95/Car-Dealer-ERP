import mongoose, { Document, Schema } from "mongoose";

export interface IInvoiceLineItem {
  description: string;
  quantity: number;
  unitPriceNGN: number;
  totalPriceNGN: number;
}

export interface IAccountingInvoice extends Document {
  invoiceNumber: string;
  invoiceType: "Vehicle Sale" | "Workshop Service" | "Parts Retail" | "Consignment Commission" | "Trade-In Differential";
  referenceId?: string; // Order ID or Service Job Card ID

  customerName: string;
  customerTIN?: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;

  lineItems: IInvoiceLineItem[];
  subTotalNGN: number;
  firsVatRatePercent: number; // strictly 7.5%
  vatAmountNGN: number;
  discountNGN: number;
  grandTotalNGN: number;
  amountPaidNGN: number;
  balanceRemainingNGN: number;

  paymentStatus: "Unpaid" | "Partially Paid" | "Paid in Full" | "Overdue" | "Cancelled";
  paymentDueDate: Date;
  issueDate: Date;
  bankAccountDetails: string;
  firsTaxFilingPeriod: string; // e.g. "2026-Q1"

  createdAt: Date;
  updatedAt: Date;
}

const accountingInvoiceSchema = new Schema<IAccountingInvoice>(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    invoiceType: {
      type: String,
      required: true,
      enum: ["Vehicle Sale", "Workshop Service", "Parts Retail", "Consignment Commission", "Trade-In Differential"],
      default: "Vehicle Sale",
      index: true,
    },
    referenceId: {
      type: String,
      default: "",
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerTIN: {
      type: String,
      default: "",
    },
    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    customerAddress: {
      type: String,
      default: "",
    },

    lineItems: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 },
        unitPriceNGN: { type: Number, required: true },
        totalPriceNGN: { type: Number, required: true },
      },
    ],

    subTotalNGN: {
      type: Number,
      required: true,
      default: 0,
    },
    firsVatRatePercent: {
      type: Number,
      default: 7.5,
    },
    vatAmountNGN: {
      type: Number,
      default: 0,
    },
    discountNGN: {
      type: Number,
      default: 0,
    },
    grandTotalNGN: {
      type: Number,
      required: true,
      default: 0,
    },
    amountPaidNGN: {
      type: Number,
      default: 0,
    },
    balanceRemainingNGN: {
      type: Number,
      default: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Partially Paid", "Paid in Full", "Overdue", "Cancelled"],
      default: "Unpaid",
      index: true,
    },
    paymentDueDate: {
      type: Date,
      required: true,
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    bankAccountDetails: {
      type: String,
      default: "Zenith Bank PLC | Account No: 1014920847 | Car Deals CMS Master Treasury",
    },
    firsTaxFilingPeriod: {
      type: String,
      default: "2026-Q1",
    },
  },
  {
    timestamps: true,
  }
);

// Auto-calculate VAT & Totals
accountingInvoiceSchema.pre("save", function (next) {
  this.subTotalNGN = (this.lineItems || []).reduce(
    (acc, curr) => acc + (curr.totalPriceNGN || curr.quantity * curr.unitPriceNGN || 0),
    0
  );
  this.vatAmountNGN = Math.round(this.subTotalNGN * (this.firsVatRatePercent / 100));
  this.grandTotalNGN = this.subTotalNGN + this.vatAmountNGN - (this.discountNGN || 0);
  this.balanceRemainingNGN = Math.max(0, this.grandTotalNGN - (this.amountPaidNGN || 0));

  if (this.balanceRemainingNGN === 0 && this.amountPaidNGN > 0) {
    this.paymentStatus = "Paid in Full";
  } else if (this.amountPaidNGN > 0 && this.balanceRemainingNGN > 0) {
    this.paymentStatus = "Partially Paid";
  }
  next();
});

export const AccountingInvoice = mongoose.model<IAccountingInvoice>("AccountingInvoice", accountingInvoiceSchema);


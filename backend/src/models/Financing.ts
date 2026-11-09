import mongoose, { Document, Schema } from "mongoose";

export interface IFinancing extends Document {
  applicationId: string;
  customerId?: mongoose.Types.ObjectId;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  bvn: string;
  monthlyIncomeNGN: number;
  employerName: string;

  vehicleId: mongoose.Types.ObjectId;
  vehiclePriceNGN: number;
  downPaymentNGN: number;
  loanAmountNGN: number;
  tenorMonths: 12 | 24 | 36 | 48 | 60;
  partnerBank: "Zenith Bank Auto Loan" | "Access Bank Drive Easy" | "Stanbic IBTC Vehicle Finance" | "GTBank Auto Credit";
  interestRateAnnualPercent: number;
  monthlyRepaymentNGN: number;
  totalRepaymentNGN: number;

  status:
    | "Application Submitted"
    | "Credit Bureau Verification (CRC/FirstCentral)"
    | "Bank Underwriting"
    | "Approved & Disbursed"
    | "Declined"
    | "Defaulted";

  creditBureauScore?: number;
  approvalReference?: string;
  underwriterNotes?: string;
  supportingDocuments: {
    name: string;
    url: string;
    verified: boolean;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

const financingSchema = new Schema<IFinancing>(
  {
    applicationId: {
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
    applicantName: {
      type: String,
      required: true,
      trim: true,
    },
    applicantEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    applicantPhone: {
      type: String,
      required: true,
    },
    bvn: {
      type: String,
      required: true,
      trim: true,
    },
    monthlyIncomeNGN: {
      type: Number,
      required: true,
    },
    employerName: {
      type: String,
      default: "",
    },
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    vehiclePriceNGN: {
      type: Number,
      required: true,
    },
    downPaymentNGN: {
      type: Number,
      required: true,
    },
    loanAmountNGN: {
      type: Number,
      required: true,
    },
    tenorMonths: {
      type: Number,
      enum: [12, 24, 36, 48, 60],
      default: 36,
    },
    partnerBank: {
      type: String,
      enum: [
        "Zenith Bank Auto Loan",
        "Access Bank Drive Easy",
        "Stanbic IBTC Vehicle Finance",
        "GTBank Auto Credit",
      ],
      default: "Zenith Bank Auto Loan",
    },
    interestRateAnnualPercent: {
      type: Number,
      default: 18.5, // 18.5% p.a.
    },
    monthlyRepaymentNGN: {
      type: Number,
      default: 0,
    },
    totalRepaymentNGN: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: [
        "Application Submitted",
        "Credit Bureau Verification (CRC/FirstCentral)",
        "Bank Underwriting",
        "Approved & Disbursed",
        "Declined",
        "Defaulted",
      ],
      default: "Application Submitted",
      index: true,
    },
    creditBureauScore: {
      type: Number,
      default: 720,
    },
    approvalReference: {
      type: String,
      default: "",
    },
    underwriterNotes: {
      type: String,
      default: "",
    },
    supportingDocuments: [
      {
        name: String,
        url: String,
        verified: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Auto-calculate monthly repayments using reducing balance amortization or simple interest
financingSchema.pre("save", function (next) {
  this.loanAmountNGN = Math.max(0, this.vehiclePriceNGN - this.downPaymentNGN);
  const monthlyRate = (this.interestRateAnnualPercent || 18.5) / 100 / 12;
  const n = this.tenorMonths || 36;
  if (monthlyRate > 0 && n > 0 && this.loanAmountNGN > 0) {
    const emi = (this.loanAmountNGN * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    this.monthlyRepaymentNGN = Math.round(emi);
    this.totalRepaymentNGN = Math.round(emi * n);
  }
  next();
});

export const Financing = mongoose.model<IFinancing>("Financing", financingSchema);


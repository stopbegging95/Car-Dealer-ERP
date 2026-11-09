"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Financing = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const financingSchema = new mongoose_1.Schema({
    applicationId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        index: true,
    },
    customerId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
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
exports.Financing = mongoose_1.default.model("Financing", financingSchema);

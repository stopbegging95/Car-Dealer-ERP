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
exports.AccountingInvoice = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const accountingInvoiceSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
// Auto-calculate VAT & Totals
accountingInvoiceSchema.pre("save", function (next) {
    this.subTotalNGN = (this.lineItems || []).reduce((acc, curr) => acc + (curr.totalPriceNGN || curr.quantity * curr.unitPriceNGN || 0), 0);
    this.vatAmountNGN = Math.round(this.subTotalNGN * (this.firsVatRatePercent / 100));
    this.grandTotalNGN = this.subTotalNGN + this.vatAmountNGN - (this.discountNGN || 0);
    this.balanceRemainingNGN = Math.max(0, this.grandTotalNGN - (this.amountPaidNGN || 0));
    if (this.balanceRemainingNGN === 0 && this.amountPaidNGN > 0) {
        this.paymentStatus = "Paid in Full";
    }
    else if (this.amountPaidNGN > 0 && this.balanceRemainingNGN > 0) {
        this.paymentStatus = "Partially Paid";
    }
    next();
});
exports.AccountingInvoice = mongoose_1.default.model("AccountingInvoice", accountingInvoiceSchema);

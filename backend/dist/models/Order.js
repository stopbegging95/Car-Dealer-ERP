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
exports.Order = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const orderSchema = new mongoose_1.Schema({
    orderNumber: {
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
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    notes: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});
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
    }
    else if (this.depositAmountNGN > 0 && this.balanceDueNGN > 0) {
        this.paymentStatus = "Partially Paid";
    }
    next();
});
exports.Order = mongoose_1.default.model("Order", orderSchema);

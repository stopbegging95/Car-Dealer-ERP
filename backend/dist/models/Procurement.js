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
exports.Procurement = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const procurementSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});
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
    }
    else {
        this.requiresHighValueApproval = false;
    }
    next();
});
exports.Procurement = mongoose_1.default.model("Procurement", procurementSchema);

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
exports.TradeInSwap = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const tradeInSwapSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
tradeInSwapSchema.pre("save", function (next) {
    const desiredPrice = this.desiredVehicleSummary?.priceNGN || 0;
    const offer = this.offeredVehicle?.appraisalOfferNGN || 0;
    this.swapDifferentialNGN = Math.max(0, desiredPrice - offer);
    next();
});
exports.TradeInSwap = mongoose_1.default.model("TradeInSwap", tradeInSwapSchema);

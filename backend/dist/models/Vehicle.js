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
exports.Vehicle = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const vehicleSchema = new mongoose_1.Schema({
    vin: {
        type: String,
        required: [true, "VIN is required"],
        unique: true,
        uppercase: true,
        trim: true,
        index: true,
    },
    stockId: {
        type: String,
        required: [true, "Stock ID is required"],
        unique: true,
        uppercase: true,
        trim: true,
        index: true,
    },
    make: {
        type: String,
        required: [true, "Make is required"],
        trim: true,
        index: true,
    },
    modelName: {
        type: String,
        required: [true, "Model name is required"],
        trim: true,
        index: true,
    },
    year: {
        type: Number,
        required: [true, "Model year is required"],
        min: 1990,
        max: new Date().getFullYear() + 2,
        index: true,
    },
    trim: {
        type: String,
        default: "",
    },
    category: {
        type: String,
        required: true,
        default: "Luxury SUV",
        index: true,
    },
    bodyType: {
        type: String,
        required: true,
        default: "SUV",
    },
    exteriorColor: {
        type: String,
        required: true,
        default: "Obsidian Black",
    },
    interiorColor: {
        type: String,
        required: true,
        default: "Cognac Brown Leather",
    },
    transmission: {
        type: String,
        required: true,
        enum: ["Automatic", "Manual", "Dual-Clutch", "Direct-Drive EV"],
        default: "Automatic",
    },
    fuelType: {
        type: String,
        required: true,
        enum: ["Petrol", "Diesel", "Hybrid", "Plug-in Hybrid", "Electric"],
        default: "Petrol",
    },
    engineCapacity: {
        type: String,
        default: "3.5L V6 Twin-Turbo",
    },
    mileageKm: {
        type: Number,
        required: true,
        default: 0,
    },
    condition: {
        type: String,
        required: true,
        enum: ["Brand New", "Foreign Used (Tokunbo)", "Certified Pre-Owned", "Local Used"],
        default: "Certified Pre-Owned",
    },
    status: {
        type: String,
        required: true,
        enum: [
            "Sourcing",
            "In-Transit",
            "Customs Clearing",
            "Yard Holding",
            "Recon & Detailing",
            "Inspection Pending",
            "Showroom Ready",
            "Reserved",
            "Under Financing",
            "Sold",
            "Delivered",
            "Trade-In Pending",
            "Archived",
        ],
        default: "Showroom Ready",
        index: true,
    },
    // Financials in NGN
    acquisitionCostNGN: {
        type: Number,
        required: true,
        default: 0,
    },
    customsDutyNGN: {
        type: Number,
        default: 0,
    },
    clearingCostNGN: {
        type: Number,
        default: 0,
    },
    reconCostNGN: {
        type: Number,
        default: 0,
    },
    landedCostNGN: {
        type: Number,
        default: 0,
    },
    listingPriceNGN: {
        type: Number,
        required: [true, "Listing price in NGN is required"],
        index: true,
    },
    minAcceptablePriceNGN: {
        type: Number,
        default: 0,
    },
    firsVatNGN: {
        type: Number,
        default: 0,
    },
    isPromotional: {
        type: Boolean,
        default: false,
    },
    promotionalPriceNGN: {
        type: Number,
    },
    // Media
    images: {
        type: [String],
        default: [],
    },
    thumbnail: {
        type: String,
        default: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80",
    },
    videoUrl: {
        type: String,
    },
    virtualTour360Url: {
        type: String,
    },
    // Hub location
    currentHub: {
        type: String,
        required: true,
        default: "Victoria Island HQ, Lagos",
        index: true,
    },
    bayNumber: {
        type: String,
        default: "Bay 01",
    },
    branchLocation: {
        type: String,
        default: "Lagos Main Showroom",
    },
    // QA & Compliance
    qaStatus: {
        type: String,
        enum: ["Pending", "Passed", "Failed", "In-Progress"],
        default: "Passed",
    },
    inspectionScore: {
        type: Number,
        default: 98,
    },
    customsDeclarationNumber: {
        type: String,
        default: "",
    },
    titleStatus: {
        type: String,
        enum: ["Clean Title", "Original Customs SGD", "Certificate of Origin", "Pending Clearance"],
        default: "Original Customs SGD",
    },
    features: {
        type: [String],
        default: [],
    },
    specifications: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {},
    },
    notes: {
        type: String,
        default: "",
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});
// Auto-calculate landed cost & FIRS VAT before save
vehicleSchema.pre("save", function (next) {
    this.landedCostNGN =
        (this.acquisitionCostNGN || 0) +
            (this.customsDutyNGN || 0) +
            (this.clearingCostNGN || 0) +
            (this.reconCostNGN || 0);
    // 7.5% FIRS VAT calculation
    this.firsVatNGN = Math.round((this.listingPriceNGN || 0) * 0.075);
    next();
});
exports.Vehicle = mongoose_1.default.model("Vehicle", vehicleSchema);

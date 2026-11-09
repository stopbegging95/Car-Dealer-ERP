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
exports.ServiceWorkshop = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const serviceWorkshopSchema = new mongoose_1.Schema({
    jobCardNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        index: true,
    },
    vehicleId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Vehicle",
        required: true,
    },
    vin: {
        type: String,
        required: true,
        uppercase: true,
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
        default: "",
    },
    assignedMechanicId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    assignedMechanicName: {
        type: String,
        default: "Lead Master Technician",
    },
    bayNumber: {
        type: String,
        required: true,
        default: "Bay 01 - Diagnostics",
    },
    serviceCategory: {
        type: String,
        required: true,
        enum: [
            "Periodic Maintenance",
            "Braking System",
            "Engine Overhaul",
            "Transmission Service",
            "Air Conditioning",
            "Electrical & Diagnostics",
        ],
        default: "Periodic Maintenance",
    },
    symptomsReported: {
        type: [String],
        default: [],
    },
    diagnosticFindings: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: [
            "Queued",
            "In Diagnostics",
            "Awaiting Parts",
            "In Repair",
            "Road Test QA",
            "Completed",
            "Invoiced & Released",
        ],
        default: "Queued",
        index: true,
    },
    partsUsed: [
        {
            partId: { type: mongoose_1.Schema.Types.ObjectId, ref: "PartsInventory" },
            partName: String,
            partSku: String,
            quantity: Number,
            unitCostNGN: Number,
            totalCostNGN: Number,
        },
    ],
    laborHours: {
        type: Number,
        default: 0,
    },
    laborRatePerHourNGN: {
        type: Number,
        default: 25000, // ₦25,000/hr
    },
    totalLaborCostNGN: {
        type: Number,
        default: 0,
    },
    totalPartsCostNGN: {
        type: Number,
        default: 0,
    },
    statutoryVatNGN: {
        type: Number,
        default: 0,
    },
    totalAmountNGN: {
        type: Number,
        default: 0,
    },
    intakeDate: {
        type: Date,
        default: Date.now,
    },
    estimatedCompletionDate: Date,
    actualCompletionDate: Date,
    notes: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});
// Calculation of workshop totals
serviceWorkshopSchema.pre("save", function (next) {
    this.totalLaborCostNGN = (this.laborHours || 0) * (this.laborRatePerHourNGN || 0);
    this.totalPartsCostNGN = (this.partsUsed || []).reduce((acc, curr) => acc + (curr.totalCostNGN || (curr.quantity * curr.unitCostNGN) || 0), 0);
    const subtotal = this.totalLaborCostNGN + this.totalPartsCostNGN;
    this.statutoryVatNGN = Math.round(subtotal * 0.075);
    this.totalAmountNGN = subtotal + this.statutoryVatNGN;
    next();
});
exports.ServiceWorkshop = mongoose_1.default.model("ServiceWorkshop", serviceWorkshopSchema);

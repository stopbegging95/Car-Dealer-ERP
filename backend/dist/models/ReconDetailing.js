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
exports.ReconDetailing = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const reconDetailingSchema = new mongoose_1.Schema({
    reconId: {
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
    technicianName: {
        type: String,
        required: true,
        default: "Senior Detailing Specialist",
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    targetCompletionDate: {
        type: Date,
        required: true,
    },
    actualCompletionDate: Date,
    currentStage: {
        type: String,
        enum: [
            "Stage 1: Decontamination Wash",
            "Stage 2: Paint Correction & Compound",
            "Stage 3: Interior Leather Extraction",
            "Stage 4: 9H Ceramic Coating / PPF",
            "Stage 5: Final Executive QC Signoff",
        ],
        default: "Stage 1: Decontamination Wash",
        index: true,
    },
    stageProgressPercent: {
        type: Number,
        default: 20,
    },
    stagesCompleted: [
        {
            stageName: String,
            completed: { type: Boolean, default: false },
            completedAt: Date,
            completedBy: String,
            remarks: String,
        },
    ],
    ceramicCoatingWarrantyYears: {
        type: Number,
        default: 3,
    },
    paintGaugeBeforeMicrons: {
        type: Number,
        default: 110,
    },
    paintGaugeAfterMicrons: {
        type: Number,
        default: 125, // with ceramic layer
    },
    totalReconCostNGN: {
        type: Number,
        default: 250000,
    },
    status: {
        type: String,
        enum: ["In-Progress", "Completed", "On-Hold"],
        default: "In-Progress",
        index: true,
    },
}, {
    timestamps: true,
});
exports.ReconDetailing = mongoose_1.default.model("ReconDetailing", reconDetailingSchema);

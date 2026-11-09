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
exports.InspectionQA = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const inspectionQASchema = new mongoose_1.Schema({
    inspectionId: {
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
        index: true,
    },
    vin: {
        type: String,
        required: true,
        uppercase: true,
    },
    inspectorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    inspectorName: {
        type: String,
        required: true,
    },
    odometerKm: {
        type: Number,
        required: true,
        default: 0,
    },
    inspectionDate: {
        type: Date,
        default: Date.now,
    },
    systems: {
        powertrainScore: { type: Number, default: 95 },
        powertrainPassed: { type: Boolean, default: true },
        powertrainNotes: { type: String, default: "Engine compression and transmission pressure within OEM tolerances." },
        brakeSuspensionScore: { type: Number, default: 92 },
        brakeSuspensionPassed: { type: Boolean, default: true },
        brakeSuspensionNotes: { type: String, default: "Brake pads >8mm, air suspension holds pressure." },
        electricalOBDScore: { type: Number, default: 100 },
        electricalOBDPassed: { type: Boolean, default: true },
        obdDiagnosticCodes: { type: [String], default: [] },
        bodyPaintThicknessScore: { type: Number, default: 96 },
        bodyPaintPassed: { type: Boolean, default: true },
        paintGaugeMicronsAverage: { type: Number, default: 115 },
        interiorLuxuryScore: { type: Number, default: 98 },
        interiorLuxuryPassed: { type: Boolean, default: true },
        tiresWheelsSafetyScore: { type: Number, default: 94 },
        tiresSafetyPassed: { type: Boolean, default: true },
        treadDepthMm: { type: Number, default: 6.5 },
    },
    overallScorePercent: {
        type: Number,
        default: 96,
    },
    qaStatus: {
        type: String,
        enum: ["Pending", "In-Progress", "Passed - Approved for Sale", "Failed - Sent to Workshop"],
        default: "Passed - Approved for Sale",
        index: true,
    },
    certNumber: {
        type: String,
        default: "",
    },
    digitalSignature: {
        type: String,
        default: "",
    },
    requiredRepairs: [
        {
            item: String,
            estimatedCostNGN: Number,
            priority: { type: String, enum: ["Low", "Medium", "Critical"], default: "Low" },
        },
    ],
}, {
    timestamps: true,
});
// Calculate overall average score
inspectionQASchema.pre("save", function (next) {
    const scores = [
        this.systems?.powertrainScore || 0,
        this.systems?.brakeSuspensionScore || 0,
        this.systems?.electricalOBDScore || 0,
        this.systems?.bodyPaintThicknessScore || 0,
        this.systems?.interiorLuxuryScore || 0,
        this.systems?.tiresWheelsSafetyScore || 0,
    ];
    this.overallScorePercent = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    if (this.overallScorePercent >= 90 && !this.certNumber) {
        this.certNumber = `PDI-CERT-${Date.now().toString(36).toUpperCase()}`;
    }
    next();
});
exports.InspectionQA = mongoose_1.default.model("InspectionQA", inspectionQASchema);

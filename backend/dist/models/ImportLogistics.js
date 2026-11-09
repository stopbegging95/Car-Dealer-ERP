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
exports.ImportLogistics = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const importLogisticsSchema = new mongoose_1.Schema({
    shipmentId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        index: true,
    },
    trackingNumber: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    vesselName: {
        type: String,
        required: true,
    },
    voyageNumber: {
        type: String,
        required: true,
    },
    bolNumber: {
        type: String,
        required: true,
        index: true,
    },
    containerNumber: {
        type: String,
        required: true,
    },
    vinList: {
        type: [String],
        default: [],
    },
    originPort: {
        type: String,
        default: "Port of Newark / New York, USA",
    },
    destinationPort: {
        type: String,
        enum: [
            "Apapa Port Lagos",
            "Tin Can Island Port (TCIT)",
            "Onne Port Port Harcourt",
        ],
        default: "Tin Can Island Port (TCIT)",
        index: true,
    },
    shippingLine: {
        type: String,
        default: "Grimaldi Lines / MSC",
    },
    clearingAgentName: {
        type: String,
        default: "Prestige Maritime Freight & Logistics",
    },
    clearingAgentPhone: {
        type: String,
        default: "+234 803 555 0192",
    },
    customsSGDNumber: {
        type: String,
        default: "",
    },
    customsDutyPaidNGN: {
        type: Number,
        default: 0,
    },
    terminalChargesNGN: {
        type: Number,
        default: 0,
    },
    shippingCompanyChargesNGN: {
        type: Number,
        default: 0,
    },
    demurrageDaysCount: {
        type: Number,
        default: 0,
    },
    demurrageAccruedNGN: {
        type: Number,
        default: 0,
    },
    departureDate: {
        type: Date,
        required: true,
    },
    etaPortDate: {
        type: Date,
        required: true,
    },
    actualArrivalDate: Date,
    gateExitDate: Date,
    clearingStatus: {
        type: String,
        enum: [
            "At Sea",
            "Vessel Berthed",
            "Customs PAAR Verification",
            "Physical Examination",
            "Duty Assessed & Paid",
            "Exit Gate Pass Issued",
            "En-Route to Central Depot",
            "Received & Discharged at HQ",
        ],
        default: "At Sea",
        index: true,
    },
    notes: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});
exports.ImportLogistics = mongoose_1.default.model("ImportLogistics", importLogisticsSchema);

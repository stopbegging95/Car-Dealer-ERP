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
exports.CRMClient = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const crmClientSchema = new mongoose_1.Schema({
    clientId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        index: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        default: "",
    },
    tier: {
        type: String,
        enum: ["Standard", "Gold Member", "Platinum VIP", "Presidential HNWI"],
        default: "Standard",
        index: true,
    },
    totalPurchasesCount: {
        type: Number,
        default: 0,
    },
    lifetimeSpendNGN: {
        type: Number,
        default: 0,
    },
    preferredBrands: {
        type: [String],
        default: ["Mercedes-Benz", "Land Rover"],
    },
    relationshipManagerName: {
        type: String,
        default: "VIP Private Client Executive",
    },
    inquiries: [
        {
            date: { type: Date, default: Date.now },
            subject: String,
            vehicleInterest: String,
            status: { type: String, enum: ["Open", "Contacted", "Closed"], default: "Open" },
            notes: String,
        },
    ],
    complaints: [
        {
            ticketId: String,
            subject: String,
            priority: { type: String, enum: ["Low", "Medium", "Urgent"], default: "Medium" },
            status: { type: String, enum: ["Open", "Investigating", "Resolved"], default: "Open" },
            resolutionNotes: String,
            createdAt: { type: Date, default: Date.now },
        },
    ],
}, {
    timestamps: true,
});
exports.CRMClient = mongoose_1.default.model("CRMClient", crmClientSchema);

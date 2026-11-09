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
exports.PartsInventory = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const partsInventorySchema = new mongoose_1.Schema({
    sku: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
        index: true,
    },
    partName: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        enum: [
            "Engine",
            "Braking",
            "Suspension",
            "Electrical",
            "Body Panels",
            "Filters & Fluids",
            "Performance",
            "Interior Accessories",
        ],
        default: "Filters & Fluids",
        index: true,
    },
    brand: {
        type: String,
        required: true,
        default: "OEM Genuine",
    },
    compatibleModels: {
        type: [String],
        default: [],
    },
    quantityInStock: {
        type: Number,
        required: true,
        default: 0,
    },
    minThresholdAlert: {
        type: Number,
        required: true,
        default: 5,
    },
    costPriceNGN: {
        type: Number,
        required: true,
        default: 0,
    },
    sellingPriceNGN: {
        type: Number,
        required: true,
        default: 0,
    },
    aisleShelfLocation: {
        type: String,
        default: "Shelf A-1",
    },
    supplier: {
        type: String,
        default: "Official Brand Distributor",
    },
    lastRestockDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["In Stock", "Low Stock", "Out of Stock"],
        default: "In Stock",
        index: true,
    },
    notes: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});
// Auto-determine stock status before save
partsInventorySchema.pre("save", function (next) {
    if (this.quantityInStock <= 0) {
        this.status = "Out of Stock";
    }
    else if (this.quantityInStock <= this.minThresholdAlert) {
        this.status = "Low Stock";
    }
    else {
        this.status = "In Stock";
    }
    next();
});
exports.PartsInventory = mongoose_1.default.model("PartsInventory", partsInventorySchema);

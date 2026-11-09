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
exports.CMSContent = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const cmsContentSchema = new mongoose_1.Schema({
    contentType: {
        type: String,
        required: true,
        enum: [
            "Hero Slide",
            "Brand Partner",
            "Announcement Ticker",
            "Featured Collection",
            "Customer Review",
            "Showroom Showcase",
        ],
        default: "Hero Slide",
        index: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    subtitle: {
        type: String,
        default: "",
    },
    badgeText: {
        type: String,
        default: "",
    },
    ctaText: {
        type: String,
        default: "Explore Inventory",
    },
    ctaLink: {
        type: String,
        default: "/inventory",
    },
    secondaryCtaText: {
        type: String,
        default: "",
    },
    secondaryCtaLink: {
        type: String,
        default: "",
    },
    imageUrl: {
        type: String,
        required: true,
    },
    secondaryImageUrl: {
        type: String,
        default: "",
    },
    orderIndex: {
        type: Number,
        default: 0,
        index: true,
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true,
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {},
    },
    publishedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
exports.CMSContent = mongoose_1.default.model("CMSContent", cmsContentSchema);

import mongoose, { Document, Schema } from "mongoose";

export type VehicleStatus =
  | "Sourcing"
  | "In-Transit"
  | "Customs Clearing"
  | "Yard Holding"
  | "Recon & Detailing"
  | "Inspection Pending"
  | "Showroom Ready"
  | "Reserved"
  | "Under Financing"
  | "Sold"
  | "Delivered"
  | "Trade-In Pending"
  | "Archived";

export interface IVehicle extends Document {
  vin: string;
  stockId: string;
  make: string;
  modelName: string;
  year: number;
  trim?: string;
  category: string;
  bodyType: string;
  exteriorColor: string;
  interiorColor: string;
  transmission: "Automatic" | "Manual" | "Dual-Clutch" | "Direct-Drive EV";
  fuelType: "Petrol" | "Diesel" | "Hybrid" | "Plug-in Hybrid" | "Electric";
  engineCapacity?: string;
  mileageKm: number;
  condition: "Brand New" | "Foreign Used (Tokunbo)" | "Certified Pre-Owned" | "Local Used";
  status: VehicleStatus;

  // Financials in Nigerian Naira (NGN)
  acquisitionCostNGN: number;
  customsDutyNGN: number;
  clearingCostNGN: number;
  reconCostNGN: number;
  landedCostNGN: number;
  listingPriceNGN: number;
  minAcceptablePriceNGN: number;
  firsVatNGN: number;
  isPromotional: boolean;
  promotionalPriceNGN?: number;

  // Media
  images: string[];
  thumbnail: string;
  videoUrl?: string;
  virtualTour360Url?: string;

  // Dealership Location & Hub
  currentHub: string;
  bayNumber?: string;
  branchLocation: string;

  // Compliance & QA
  qaStatus: "Pending" | "Passed" | "Failed" | "In-Progress";
  inspectionScore?: number;
  customsDeclarationNumber?: string;
  titleStatus: "Clean Title" | "Original Customs SGD" | "Certificate of Origin" | "Pending Clearance";
  features: string[];
  specifications: Record<string, any>;
  notes?: string;

  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
}

const vehicleSchema = new Schema<IVehicle>(
  {
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
      type: Schema.Types.Mixed,
      default: {},
    },
    notes: {
      type: String,
      default: "",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

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

export const Vehicle = mongoose.model<IVehicle>("Vehicle", vehicleSchema);


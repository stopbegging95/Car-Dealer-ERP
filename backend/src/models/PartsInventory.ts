import mongoose, { Document, Schema } from "mongoose";

export interface IPartsInventory extends Document {
  sku: string;
  partName: string;
  category: "Engine" | "Braking" | "Suspension" | "Electrical" | "Body Panels" | "Filters & Fluids" | "Performance" | "Interior Accessories";
  brand: string;
  compatibleModels: string[];
  quantityInStock: number;
  minThresholdAlert: number;
  costPriceNGN: number;
  sellingPriceNGN: number;
  aisleShelfLocation: string;
  supplier: string;
  lastRestockDate: Date;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const partsInventorySchema = new Schema<IPartsInventory>(
  {
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
  },
  {
    timestamps: true,
  }
);

// Auto-determine stock status before save
partsInventorySchema.pre("save", function (next) {
  if (this.quantityInStock <= 0) {
    this.status = "Out of Stock";
  } else if (this.quantityInStock <= this.minThresholdAlert) {
    this.status = "Low Stock";
  } else {
    this.status = "In Stock";
  }
  next();
});

export const PartsInventory = mongoose.model<IPartsInventory>("PartsInventory", partsInventorySchema);


import mongoose, { Document, Schema } from "mongoose";

export interface IInspectionQA extends Document {
  inspectionId: string;
  vehicleId: mongoose.Types.ObjectId;
  vin: string;
  inspectorId: mongoose.Types.ObjectId;
  inspectorName: string;
  odometerKm: number;
  inspectionDate: Date;

  systems: {
    powertrainScore: number;
    powertrainPassed: boolean;
    powertrainNotes: string;

    brakeSuspensionScore: number;
    brakeSuspensionPassed: boolean;
    brakeSuspensionNotes: string;

    electricalOBDScore: number;
    electricalOBDPassed: boolean;
    obdDiagnosticCodes: string[];

    bodyPaintThicknessScore: number;
    bodyPaintPassed: boolean;
    paintGaugeMicronsAverage: number;

    interiorLuxuryScore: number;
    interiorLuxuryPassed: boolean;

    tiresWheelsSafetyScore: number;
    tiresSafetyPassed: boolean;
    treadDepthMm: number;
  };

  overallScorePercent: number;
  qaStatus: "Pending" | "In-Progress" | "Passed - Approved for Sale" | "Failed - Sent to Workshop";
  certNumber?: string;
  digitalSignature?: string;

  requiredRepairs: {
    item: string;
    estimatedCostNGN: number;
    priority: "Low" | "Medium" | "Critical";
  }[];

  createdAt: Date;
  updatedAt: Date;
}

const inspectionQASchema = new Schema<IInspectionQA>(
  {
    inspectionId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    vehicleId: {
      type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

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

export const InspectionQA = mongoose.model<IInspectionQA>("InspectionQA", inspectionQASchema);


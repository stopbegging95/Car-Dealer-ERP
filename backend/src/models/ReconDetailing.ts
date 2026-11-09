import mongoose, { Document, Schema } from "mongoose";

export interface IReconDetailing extends Document {
  reconId: string;
  vehicleId: mongoose.Types.ObjectId;
  vin: string;
  technicianName: string;
  startDate: Date;
  targetCompletionDate: Date;
  actualCompletionDate?: Date;

  currentStage:
    | "Stage 1: Decontamination Wash"
    | "Stage 2: Paint Correction & Compound"
    | "Stage 3: Interior Leather Extraction"
    | "Stage 4: 9H Ceramic Coating / PPF"
    | "Stage 5: Final Executive QC Signoff";

  stageProgressPercent: number;
  stagesCompleted: {
    stageName: string;
    completed: boolean;
    completedAt?: Date;
    completedBy?: string;
    remarks?: string;
  }[];

  ceramicCoatingWarrantyYears: number;
  paintGaugeBeforeMicrons: number;
  paintGaugeAfterMicrons: number;
  totalReconCostNGN: number;
  status: "In-Progress" | "Completed" | "On-Hold";

  createdAt: Date;
  updatedAt: Date;
}

const reconDetailingSchema = new Schema<IReconDetailing>(
  {
    reconId: {
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
  },
  {
    timestamps: true,
  }
);

export const ReconDetailing = mongoose.model<IReconDetailing>("ReconDetailing", reconDetailingSchema);


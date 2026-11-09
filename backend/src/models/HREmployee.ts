import mongoose, { Document, Schema } from "mongoose";

export interface IHREmployee extends Document {
  employeeId: string;
  userId?: mongoose.Types.ObjectId;
  fullName: string;
  department: string;
  roleTitle: string;
  employmentType: "Full-Time Executive" | "Technical Specialist" | "Sales Associate" | "Contractor";

  // Payroll in NGN
  salaryMonthlyNGN: number;
  allowancesNGN: number;
  pensionDeductionNGN: number;
  taxPAYENGN: number;
  netSalaryNGN: number;

  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };

  attendanceLogs: {
    date: string;
    checkInTime?: string;
    checkOutTime?: string;
    status: "Present" | "Late" | "Absent" | "Excused";
  }[];

  leaveRequests: {
    leaveType: "Annual" | "Sick" | "Maternity/Paternity" | "Casual";
    startDate: Date;
    endDate: Date;
    status: "Pending" | "Approved" | "Rejected";
    reason?: string;
  }[];

  hireDate: Date;
  status: "Active" | "On Leave" | "Suspended" | "Terminated";

  createdAt: Date;
  updatedAt: Date;
}

const hrEmployeeSchema = new Schema<IHREmployee>(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      index: true,
    },
    roleTitle: {
      type: String,
      required: true,
    },
    employmentType: {
      type: String,
      enum: ["Full-Time Executive", "Technical Specialist", "Sales Associate", "Contractor"],
      default: "Full-Time Executive",
    },

    salaryMonthlyNGN: {
      type: Number,
      required: true,
      default: 0,
    },
    allowancesNGN: {
      type: Number,
      default: 0,
    },
    pensionDeductionNGN: {
      type: Number,
      default: 0,
    },
    taxPAYENGN: {
      type: Number,
      default: 0,
    },
    netSalaryNGN: {
      type: Number,
      default: 0,
    },

    bankDetails: {
      bankName: { type: String, default: "Zenith Bank PLC" },
      accountNumber: { type: String, default: "" },
      accountName: { type: String, default: "" },
    },

    attendanceLogs: [
      {
        date: String,
        checkInTime: String,
        checkOutTime: String,
        status: { type: String, enum: ["Present", "Late", "Absent", "Excused"], default: "Present" },
      },
    ],

    leaveRequests: [
      {
        leaveType: { type: String, enum: ["Annual", "Sick", "Maternity/Paternity", "Casual"], default: "Annual" },
        startDate: Date,
        endDate: Date,
        status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
        reason: String,
      },
    ],

    hireDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Active", "On Leave", "Suspended", "Terminated"],
      default: "Active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-calculate Net Salary before save
hrEmployeeSchema.pre("save", function (next) {
  const gross = (this.salaryMonthlyNGN || 0) + (this.allowancesNGN || 0);
  // Standard Nigerian statutory deduction: 8% Pension, progressive PAYE tax approximation
  if (!this.pensionDeductionNGN) {
    this.pensionDeductionNGN = Math.round(gross * 0.08);
  }
  if (!this.taxPAYENGN) {
    this.taxPAYENGN = Math.round(gross * 0.12);
  }
  this.netSalaryNGN = gross - this.pensionDeductionNGN - this.taxPAYENGN;
  next();
});

export const HREmployee = mongoose.model<IHREmployee>("HREmployee", hrEmployeeSchema);


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
exports.HREmployee = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const hrEmployeeSchema = new mongoose_1.Schema({
    employeeId: {
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
}, {
    timestamps: true,
});
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
exports.HREmployee = mongoose_1.default.model("HREmployee", hrEmployeeSchema);

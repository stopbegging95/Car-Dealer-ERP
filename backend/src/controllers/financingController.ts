import { Request, Response, NextFunction } from "express";
import { Financing } from "../models/Financing.js";
import { Vehicle } from "../models/Vehicle.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";
import { AuditLog } from "../models/AuditLog.js";

export const getFinancingApplications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, partnerBank, search, page = 1, limit = 20 } = req.query;
    const filter: Record<string, any> = {};

    if (status) filter.status = status;
    if (partnerBank) filter.partnerBank = partnerBank;
    if (search) {
      filter.$or = [
        { applicationId: { $regex: search as string, $options: "i" } },
        { applicantName: { $regex: search as string, $options: "i" } },
        { applicantEmail: { $regex: search as string, $options: "i" } },
        { bvn: { $regex: search as string, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const applications = await Financing.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Financing.countDocuments(filter);

    res.status(200).json(
      new ApiResponse(200, {
        applications,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
      }, "Financing applications retrieved.")
    );
  } catch (error) {
    next(error);
  }
};

export const createFinancingApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      applicantName,
      applicantEmail,
      applicantPhone,
      bvn,
      monthlyIncomeNGN,
      employerName,
      vehicleId,
      downPaymentNGN,
      tenorMonths,
      partnerBank,
      interestRateAnnualPercent,
      supportingDocuments,
    } = req.body;

    if (!applicantName || !applicantEmail || !applicantPhone || !bvn || !vehicleId || !downPaymentNGN) {
      throw new ApiError(400, "Applicant details, BVN, Vehicle ID, and Down Payment are required.");
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      throw new ApiError(404, "Vehicle not found.");
    }

    const applicationId = `FIN-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;

    const newApp = await Financing.create({
      applicationId,
      customerId: req.user?._id,
      applicantName,
      applicantEmail: applicantEmail.toLowerCase(),
      applicantPhone,
      bvn,
      monthlyIncomeNGN: Number(monthlyIncomeNGN || 0),
      employerName: employerName || "",
      vehicleId: vehicle._id,
      vehiclePriceNGN: vehicle.listingPriceNGN,
      downPaymentNGN: Number(downPaymentNGN),
      loanAmountNGN: Math.max(0, vehicle.listingPriceNGN - Number(downPaymentNGN)),
      tenorMonths: tenorMonths || 36,
      partnerBank: partnerBank || "Zenith Bank Auto Loan",
      interestRateAnnualPercent: Number(interestRateAnnualPercent || 18.5),
      supportingDocuments: supportingDocuments || [],
    });

    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.name || "System",
      userEmail: req.user?.email || "system@dealers.com",
      userRole: req.user?.role || "financing",
      action: "FINANCING_APP_CREATED",
      module: "FINANCING",
      resourceId: newApp._id.toString(),
      details: { applicationId, bank: newApp.partnerBank, loanAmount: newApp.loanAmountNGN },
    });

    res.status(201).json(new ApiResponse(201, newApp, "Auto loan financing application submitted."));
  } catch (error) {
    next(error);
  }
};

export const updateFinancingStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, approvalReference, underwriterNotes } = req.body;

    const app = await Financing.findById(id);
    if (!app) {
      throw new ApiError(404, "Financing application not found.");
    }

    if (status) app.status = status;
    if (approvalReference) app.approvalReference = approvalReference;
    if (underwriterNotes) app.underwriterNotes = underwriterNotes;

    await app.save();

    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.name || "System",
      userEmail: req.user?.email || "system@dealers.com",
      userRole: req.user?.role || "financing",
      action: "FINANCING_STATUS_UPDATED",
      module: "FINANCING",
      resourceId: app._id.toString(),
      details: { applicationId: app.applicationId, status: app.status },
    });

    res.status(200).json(new ApiResponse(200, app, "Financing underwriting status updated."));
  } catch (error) {
    next(error);
  }
};


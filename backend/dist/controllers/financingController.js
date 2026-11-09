"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFinancingStatus = exports.createFinancingApplication = exports.getFinancingApplications = void 0;
const Financing_js_1 = require("../models/Financing.js");
const Vehicle_js_1 = require("../models/Vehicle.js");
const apiResponse_js_1 = require("../utils/apiResponse.js");
const AuditLog_js_1 = require("../models/AuditLog.js");
const getFinancingApplications = async (req, res, next) => {
    try {
        const { status, partnerBank, search, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (status)
            filter.status = status;
        if (partnerBank)
            filter.partnerBank = partnerBank;
        if (search) {
            filter.$or = [
                { applicationId: { $regex: search, $options: "i" } },
                { applicantName: { $regex: search, $options: "i" } },
                { applicantEmail: { $regex: search, $options: "i" } },
                { bvn: { $regex: search, $options: "i" } },
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const applications = await Financing_js_1.Financing.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await Financing_js_1.Financing.countDocuments(filter);
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, {
            applications,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                limit: Number(limit),
            },
        }, "Financing applications retrieved."));
    }
    catch (error) {
        next(error);
    }
};
exports.getFinancingApplications = getFinancingApplications;
const createFinancingApplication = async (req, res, next) => {
    try {
        const { applicantName, applicantEmail, applicantPhone, bvn, monthlyIncomeNGN, employerName, vehicleId, downPaymentNGN, tenorMonths, partnerBank, interestRateAnnualPercent, supportingDocuments, } = req.body;
        if (!applicantName || !applicantEmail || !applicantPhone || !bvn || !vehicleId || !downPaymentNGN) {
            throw new apiResponse_js_1.ApiError(400, "Applicant details, BVN, Vehicle ID, and Down Payment are required.");
        }
        const vehicle = await Vehicle_js_1.Vehicle.findById(vehicleId);
        if (!vehicle) {
            throw new apiResponse_js_1.ApiError(404, "Vehicle not found.");
        }
        const applicationId = `FIN-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
        const newApp = await Financing_js_1.Financing.create({
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
        await AuditLog_js_1.AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.name || "System",
            userEmail: req.user?.email || "system@dealers.com",
            userRole: req.user?.role || "financing",
            action: "FINANCING_APP_CREATED",
            module: "FINANCING",
            resourceId: newApp._id.toString(),
            details: { applicationId, bank: newApp.partnerBank, loanAmount: newApp.loanAmountNGN },
        });
        res.status(201).json(new apiResponse_js_1.ApiResponse(201, newApp, "Auto loan financing application submitted."));
    }
    catch (error) {
        next(error);
    }
};
exports.createFinancingApplication = createFinancingApplication;
const updateFinancingStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, approvalReference, underwriterNotes } = req.body;
        const app = await Financing_js_1.Financing.findById(id);
        if (!app) {
            throw new apiResponse_js_1.ApiError(404, "Financing application not found.");
        }
        if (status)
            app.status = status;
        if (approvalReference)
            app.approvalReference = approvalReference;
        if (underwriterNotes)
            app.underwriterNotes = underwriterNotes;
        await app.save();
        await AuditLog_js_1.AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.name || "System",
            userEmail: req.user?.email || "system@dealers.com",
            userRole: req.user?.role || "financing",
            action: "FINANCING_STATUS_UPDATED",
            module: "FINANCING",
            resourceId: app._id.toString(),
            details: { applicationId: app.applicationId, status: app.status },
        });
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, app, "Financing underwriting status updated."));
    }
    catch (error) {
        next(error);
    }
};
exports.updateFinancingStatus = updateFinancingStatus;

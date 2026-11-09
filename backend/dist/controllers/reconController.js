"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReconStage = exports.createReconJob = exports.getReconJobs = void 0;
const ReconDetailing_js_1 = require("../models/ReconDetailing.js");
const Vehicle_js_1 = require("../models/Vehicle.js");
const apiResponse_js_1 = require("../utils/apiResponse.js");
const AuditLog_js_1 = require("../models/AuditLog.js");
const getReconJobs = async (req, res, next) => {
    try {
        const { status, currentStage, search, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (status)
            filter.status = status;
        if (currentStage)
            filter.currentStage = currentStage;
        if (search) {
            filter.$or = [
                { reconId: { $regex: search, $options: "i" } },
                { vin: { $regex: search, $options: "i" } },
                { technicianName: { $regex: search, $options: "i" } },
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const jobs = await ReconDetailing_js_1.ReconDetailing.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await ReconDetailing_js_1.ReconDetailing.countDocuments(filter);
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, {
            reconJobs: jobs,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                limit: Number(limit),
            },
        }, "Recon and detailing jobs fetched."));
    }
    catch (error) {
        next(error);
    }
};
exports.getReconJobs = getReconJobs;
const createReconJob = async (req, res, next) => {
    try {
        const { vehicleId, vin, technicianName, targetCompletionDate, ceramicCoatingWarrantyYears, paintGaugeBeforeMicrons, totalReconCostNGN, } = req.body;
        if (!vehicleId || !vin || !targetCompletionDate) {
            throw new apiResponse_js_1.ApiError(400, "Vehicle ID, VIN, and target completion date are required.");
        }
        const reconId = `RCN-${Date.now().toString(36).toUpperCase()}`;
        const newJob = await ReconDetailing_js_1.ReconDetailing.create({
            reconId,
            vehicleId,
            vin: vin.toUpperCase().trim(),
            technicianName: technicianName || req.user?.name || "Senior Detailing Specialist",
            targetCompletionDate,
            currentStage: "Stage 1: Decontamination Wash",
            stageProgressPercent: 20,
            ceramicCoatingWarrantyYears: Number(ceramicCoatingWarrantyYears || 3),
            paintGaugeBeforeMicrons: Number(paintGaugeBeforeMicrons || 110),
            paintGaugeAfterMicrons: Number(paintGaugeBeforeMicrons || 110) + 15,
            totalReconCostNGN: Number(totalReconCostNGN || 250000),
            status: "In-Progress",
        });
        // Update vehicle status
        await Vehicle_js_1.Vehicle.findByIdAndUpdate(vehicleId, { status: "Recon & Detailing" });
        await AuditLog_js_1.AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.name || "System",
            userEmail: req.user?.email || "system@dealers.com",
            userRole: req.user?.role || "recon",
            action: "RECON_JOB_CREATED",
            module: "RECON",
            resourceId: newJob._id.toString(),
            details: { reconId, vin },
        });
        res.status(201).json(new apiResponse_js_1.ApiResponse(201, newJob, "Recon workflow initialized."));
    }
    catch (error) {
        next(error);
    }
};
exports.createReconJob = createReconJob;
const updateReconStage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { currentStage, stageProgressPercent, status, remarks } = req.body;
        const job = await ReconDetailing_js_1.ReconDetailing.findById(id);
        if (!job) {
            throw new apiResponse_js_1.ApiError(404, "Recon detailing job not found.");
        }
        if (currentStage)
            job.currentStage = currentStage;
        if (stageProgressPercent !== undefined)
            job.stageProgressPercent = Number(stageProgressPercent);
        if (status)
            job.status = status;
        if (remarks) {
            job.stagesCompleted.push({
                stageName: job.currentStage,
                completed: true,
                completedAt: new Date(),
                completedBy: req.user?.name || "Detailing Specialist",
                remarks,
            });
        }
        if (job.status === "Completed") {
            job.actualCompletionDate = new Date();
            job.stageProgressPercent = 100;
            await Vehicle_js_1.Vehicle.findByIdAndUpdate(job.vehicleId, {
                status: "Showroom Ready",
                reconCostNGN: job.totalReconCostNGN,
            });
        }
        await job.save();
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, job, "Recon detailing progress updated."));
    }
    catch (error) {
        next(error);
    }
};
exports.updateReconStage = updateReconStage;

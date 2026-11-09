"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateServiceJobStatus = exports.createServiceJobCard = exports.getServiceJobCards = void 0;
const ServiceWorkshop_js_1 = require("../models/ServiceWorkshop.js");
const PartsInventory_js_1 = require("../models/PartsInventory.js");
const apiResponse_js_1 = require("../utils/apiResponse.js");
const AuditLog_js_1 = require("../models/AuditLog.js");
const getServiceJobCards = async (req, res, next) => {
    try {
        const { status, bayNumber, search, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (status)
            filter.status = status;
        if (bayNumber)
            filter.bayNumber = bayNumber;
        if (search) {
            filter.$or = [
                { jobCardNumber: { $regex: search, $options: "i" } },
                { vin: { $regex: search, $options: "i" } },
                { customerName: { $regex: search, $options: "i" } },
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const jobs = await ServiceWorkshop_js_1.ServiceWorkshop.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await ServiceWorkshop_js_1.ServiceWorkshop.countDocuments(filter);
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, {
            jobCards: jobs,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                limit: Number(limit),
            },
        }, "Workshop job cards retrieved."));
    }
    catch (error) {
        next(error);
    }
};
exports.getServiceJobCards = getServiceJobCards;
const createServiceJobCard = async (req, res, next) => {
    try {
        const { vehicleId, vin, customerName, customerPhone, customerEmail, assignedMechanicName, bayNumber, serviceCategory, symptomsReported, laborHours, laborRatePerHourNGN, partsUsed, estimatedCompletionDate, notes, } = req.body;
        if (!vehicleId || !vin || !customerName || !customerPhone) {
            throw new apiResponse_js_1.ApiError(400, "Vehicle ID, VIN, and customer contact are required.");
        }
        const jobCardNumber = `JOB-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
        // Deduct parts inventory if parts are issued
        if (partsUsed && Array.isArray(partsUsed)) {
            for (const item of partsUsed) {
                if (item.partId && item.quantity > 0) {
                    await PartsInventory_js_1.PartsInventory.findByIdAndUpdate(item.partId, {
                        $inc: { quantityInStock: -item.quantity },
                    });
                }
            }
        }
        const newJob = await ServiceWorkshop_js_1.ServiceWorkshop.create({
            jobCardNumber,
            vehicleId,
            vin: vin.toUpperCase().trim(),
            customerName,
            customerPhone,
            customerEmail: customerEmail || "",
            assignedMechanicId: req.user?._id,
            assignedMechanicName: assignedMechanicName || req.user?.name || "Lead Master Technician",
            bayNumber: bayNumber || "Bay 01 - Diagnostics",
            serviceCategory: serviceCategory || "Periodic Maintenance",
            symptomsReported: symptomsReported || [],
            laborHours: Number(laborHours || 0),
            laborRatePerHourNGN: Number(laborRatePerHourNGN || 25000),
            partsUsed: partsUsed || [],
            estimatedCompletionDate,
            notes: notes || "",
        });
        await AuditLog_js_1.AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.name || "System",
            userEmail: req.user?.email || "system@dealers.com",
            userRole: req.user?.role || "service",
            action: "SERVICE_JOB_CREATED",
            module: "SERVICE",
            resourceId: newJob._id.toString(),
            details: { jobCardNumber, vin, total: newJob.totalAmountNGN },
        });
        res.status(201).json(new apiResponse_js_1.ApiResponse(201, newJob, "Workshop job card created successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.createServiceJobCard = createServiceJobCard;
const updateServiceJobStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, diagnosticFindings, actualCompletionDate, notes } = req.body;
        const job = await ServiceWorkshop_js_1.ServiceWorkshop.findById(id);
        if (!job) {
            throw new apiResponse_js_1.ApiError(404, "Service job card not found.");
        }
        if (status)
            job.status = status;
        if (diagnosticFindings)
            job.diagnosticFindings = diagnosticFindings;
        if (actualCompletionDate)
            job.actualCompletionDate = actualCompletionDate;
        if (notes)
            job.notes = notes;
        await job.save();
        await AuditLog_js_1.AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.name || "System",
            userEmail: req.user?.email || "system@dealers.com",
            userRole: req.user?.role || "service",
            action: "SERVICE_STATUS_UPDATED",
            module: "SERVICE",
            resourceId: job._id.toString(),
            details: { jobCardNumber: job.jobCardNumber, status: job.status },
        });
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, job, "Job card status updated."));
    }
    catch (error) {
        next(error);
    }
};
exports.updateServiceJobStatus = updateServiceJobStatus;

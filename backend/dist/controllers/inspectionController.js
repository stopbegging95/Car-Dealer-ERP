"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInspection = exports.getInspections = void 0;
const InspectionQA_js_1 = require("../models/InspectionQA.js");
const Vehicle_js_1 = require("../models/Vehicle.js");
const apiResponse_js_1 = require("../utils/apiResponse.js");
const AuditLog_js_1 = require("../models/AuditLog.js");
const getInspections = async (req, res, next) => {
    try {
        const { qaStatus, search, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (qaStatus)
            filter.qaStatus = qaStatus;
        if (search) {
            filter.$or = [
                { inspectionId: { $regex: search, $options: "i" } },
                { vin: { $regex: search, $options: "i" } },
                { inspectorName: { $regex: search, $options: "i" } },
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const inspections = await InspectionQA_js_1.InspectionQA.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await InspectionQA_js_1.InspectionQA.countDocuments(filter);
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, {
            inspections,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                limit: Number(limit),
            },
        }, "Vehicle inspection records retrieved."));
    }
    catch (error) {
        next(error);
    }
};
exports.getInspections = getInspections;
const createInspection = async (req, res, next) => {
    try {
        const { vehicleId, vin, odometerKm, systems, qaStatus, requiredRepairs } = req.body;
        if (!vehicleId || !vin) {
            throw new apiResponse_js_1.ApiError(400, "Vehicle ID and VIN are required.");
        }
        const inspectionId = `PDI-${Date.now().toString(36).toUpperCase()}`;
        const newInspection = await InspectionQA_js_1.InspectionQA.create({
            inspectionId,
            vehicleId,
            vin: vin.toUpperCase().trim(),
            inspectorId: req.user?._id,
            inspectorName: req.user?.name || "Senior Quality Inspector",
            odometerKm: Number(odometerKm || 0),
            systems: systems || {},
            qaStatus: qaStatus || "Passed - Approved for Sale",
            requiredRepairs: requiredRepairs || [],
        });
        // Update vehicle's qaStatus & inspection score
        await Vehicle_js_1.Vehicle.findByIdAndUpdate(vehicleId, {
            qaStatus: newInspection.qaStatus.includes("Passed") ? "Passed" : "Failed",
            inspectionScore: newInspection.overallScorePercent,
        });
        await AuditLog_js_1.AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.name || "System",
            userEmail: req.user?.email || "system@dealers.com",
            userRole: req.user?.role || "inspection",
            action: "PDI_INSPECTION_SUBMITTED",
            module: "INSPECTION",
            resourceId: newInspection._id.toString(),
            details: { inspectionId, vin, score: newInspection.overallScorePercent, status: newInspection.qaStatus },
        });
        res.status(201).json(new apiResponse_js_1.ApiResponse(201, newInspection, "150-Point PDI QA Report recorded successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.createInspection = createInspection;

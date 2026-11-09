import { Request, Response, NextFunction } from "express";
import { InspectionQA } from "../models/InspectionQA.js";
import { Vehicle } from "../models/Vehicle.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";
import { AuditLog } from "../models/AuditLog.js";

export const getInspections = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { qaStatus, search, page = 1, limit = 20 } = req.query;
    const filter: Record<string, any> = {};

    if (qaStatus) filter.qaStatus = qaStatus;
    if (search) {
      filter.$or = [
        { inspectionId: { $regex: search as string, $options: "i" } },
        { vin: { $regex: search as string, $options: "i" } },
        { inspectorName: { $regex: search as string, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const inspections = await InspectionQA.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await InspectionQA.countDocuments(filter);

    res.status(200).json(
      new ApiResponse(200, {
        inspections,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
      }, "Vehicle inspection records retrieved.")
    );
  } catch (error) {
    next(error);
  }
};

export const createInspection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { vehicleId, vin, odometerKm, systems, qaStatus, requiredRepairs } = req.body;

    if (!vehicleId || !vin) {
      throw new ApiError(400, "Vehicle ID and VIN are required.");
    }

    const inspectionId = `PDI-${Date.now().toString(36).toUpperCase()}`;

    const newInspection = await InspectionQA.create({
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
    await Vehicle.findByIdAndUpdate(vehicleId, {
      qaStatus: newInspection.qaStatus.includes("Passed") ? "Passed" : "Failed",
      inspectionScore: newInspection.overallScorePercent,
    });

    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.name || "System",
      userEmail: req.user?.email || "system@dealers.com",
      userRole: req.user?.role || "inspection",
      action: "PDI_INSPECTION_SUBMITTED",
      module: "INSPECTION",
      resourceId: newInspection._id.toString(),
      details: { inspectionId, vin, score: newInspection.overallScorePercent, status: newInspection.qaStatus },
    });

    res.status(201).json(new ApiResponse(201, newInspection, "150-Point PDI QA Report recorded successfully."));
  } catch (error) {
    next(error);
  }
};


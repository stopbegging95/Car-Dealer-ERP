import { Request, Response, NextFunction } from "express";
import { ServiceWorkshop } from "../models/ServiceWorkshop.js";
import { PartsInventory } from "../models/PartsInventory.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";
import { AuditLog } from "../models/AuditLog.js";

export const getServiceJobCards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, bayNumber, search, page = 1, limit = 20 } = req.query;
    const filter: Record<string, any> = {};

    if (status) filter.status = status;
    if (bayNumber) filter.bayNumber = bayNumber;
    if (search) {
      filter.$or = [
        { jobCardNumber: { $regex: search as string, $options: "i" } },
        { vin: { $regex: search as string, $options: "i" } },
        { customerName: { $regex: search as string, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const jobs = await ServiceWorkshop.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await ServiceWorkshop.countDocuments(filter);

    res.status(200).json(
      new ApiResponse(200, {
        jobCards: jobs,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
      }, "Workshop job cards retrieved.")
    );
  } catch (error) {
    next(error);
  }
};

export const createServiceJobCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      vehicleId,
      vin,
      customerName,
      customerPhone,
      customerEmail,
      assignedMechanicName,
      bayNumber,
      serviceCategory,
      symptomsReported,
      laborHours,
      laborRatePerHourNGN,
      partsUsed,
      estimatedCompletionDate,
      notes,
    } = req.body;

    if (!vehicleId || !vin || !customerName || !customerPhone) {
      throw new ApiError(400, "Vehicle ID, VIN, and customer contact are required.");
    }

    const jobCardNumber = `JOB-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;

    // Deduct parts inventory if parts are issued
    if (partsUsed && Array.isArray(partsUsed)) {
      for (const item of partsUsed) {
        if (item.partId && item.quantity > 0) {
          await PartsInventory.findByIdAndUpdate(item.partId, {
            $inc: { quantityInStock: -item.quantity },
          });
        }
      }
    }

    const newJob = await ServiceWorkshop.create({
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

    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.name || "System",
      userEmail: req.user?.email || "system@dealers.com",
      userRole: req.user?.role || "service",
      action: "SERVICE_JOB_CREATED",
      module: "SERVICE",
      resourceId: newJob._id.toString(),
      details: { jobCardNumber, vin, total: newJob.totalAmountNGN },
    });

    res.status(201).json(new ApiResponse(201, newJob, "Workshop job card created successfully."));
  } catch (error) {
    next(error);
  }
};

export const updateServiceJobStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, diagnosticFindings, actualCompletionDate, notes } = req.body;

    const job = await ServiceWorkshop.findById(id);
    if (!job) {
      throw new ApiError(404, "Service job card not found.");
    }

    if (status) job.status = status;
    if (diagnosticFindings) job.diagnosticFindings = diagnosticFindings;
    if (actualCompletionDate) job.actualCompletionDate = actualCompletionDate;
    if (notes) job.notes = notes;

    await job.save();

    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.name || "System",
      userEmail: req.user?.email || "system@dealers.com",
      userRole: req.user?.role || "service",
      action: "SERVICE_STATUS_UPDATED",
      module: "SERVICE",
      resourceId: job._id.toString(),
      details: { jobCardNumber: job.jobCardNumber, status: job.status },
    });

    res.status(200).json(new ApiResponse(200, job, "Job card status updated."));
  } catch (error) {
    next(error);
  }
};


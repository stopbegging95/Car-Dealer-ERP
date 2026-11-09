import { Request, Response, NextFunction } from "express";
import { BranchTransfer } from "../models/BranchTransfer.js";
import { Vehicle } from "../models/Vehicle.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";
import { AuditLog } from "../models/AuditLog.js";

export const getTransfers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, sourceHub, destinationHub, search, page = 1, limit = 20 } = req.query;
    const filter: Record<string, any> = {};

    if (status) filter.status = status;
    if (sourceHub) filter.sourceHub = sourceHub;
    if (destinationHub) filter.destinationHub = destinationHub;
    if (search) {
      filter.$or = [
        { transferId: { $regex: search as string, $options: "i" } },
        { waybillNumber: { $regex: search as string, $options: "i" } },
        { vin: { $regex: search as string, $options: "i" } },
        { truckPlateNumber: { $regex: search as string, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const transfers = await BranchTransfer.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await BranchTransfer.countDocuments(filter);

    res.status(200).json(
      new ApiResponse(200, {
        transfers,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
      }, "Inter-hub transfers and waybills retrieved.")
    );
  } catch (error) {
    next(error);
  }
};

export const createTransfer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      vehicleId,
      vin,
      sourceHub,
      destinationHub,
      carrierDriverName,
      carrierDriverPhone,
      truckPlateNumber,
      estimatedArrivalTime,
      notes,
    } = req.body;

    if (!vehicleId || !vin || !sourceHub || !destinationHub || !carrierDriverName || !truckPlateNumber) {
      throw new ApiError(400, "Vehicle details, route hubs, carrier driver, and truck plate are required.");
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      throw new ApiError(404, "Vehicle not found.");
    }

    const transferId = `TRF-${Date.now().toString(36).toUpperCase()}`;
    const waybillNumber = `WB-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;

    const newTransfer = await BranchTransfer.create({
      transferId,
      waybillNumber,
      vehicleId: vehicle._id,
      vin: vin.toUpperCase().trim(),
      vehicleSummary: `${vehicle.year} ${vehicle.make} ${vehicle.modelName}`,
      sourceHub,
      destinationHub,
      carrierDriverName,
      carrierDriverPhone,
      truckPlateNumber: truckPlateNumber.toUpperCase().trim(),
      estimatedArrivalTime: estimatedArrivalTime || new Date(Date.now() + 24 * 60 * 60 * 1000),
      dispatchSignoffBy: req.user?.name || "Logistics Controller",
      notes: notes || "",
    });

    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.name || "System",
      userEmail: req.user?.email || "system@dealers.com",
      userRole: req.user?.role || "operations",
      action: "BRANCH_TRANSFER_DISPATCHED",
      module: "LOGISTICS",
      resourceId: newTransfer._id.toString(),
      details: { waybillNumber, vin, from: sourceHub, to: destinationHub },
    });

    res.status(201).json(new ApiResponse(201, newTransfer, "Transfer waybill generated."));
  } catch (error) {
    next(error);
  }
};

export const acknowledgeTransferReceipt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const transfer = await BranchTransfer.findById(id);
    if (!transfer) {
      throw new ApiError(404, "Transfer not found.");
    }

    transfer.status = "Delivered & Received";
    transfer.actualArrivalTime = new Date();
    transfer.receivingSignoffBy = req.user?.name || "Receiving Hub Yard Master";
    if (notes) transfer.notes = `${transfer.notes ? transfer.notes + "\n" : ""}${notes}`;

    await transfer.save();

    // Update vehicle's current hub
    await Vehicle.findByIdAndUpdate(transfer.vehicleId, {
      currentHub: transfer.destinationHub,
    });

    res.status(200).json(new ApiResponse(200, transfer, `Vehicle received at ${transfer.destinationHub}.`));
  } catch (error) {
    next(error);
  }
};


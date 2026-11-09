import { Request, Response, NextFunction } from "express";
import { ImportLogistics } from "../models/ImportLogistics.js";
import { Vehicle } from "../models/Vehicle.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";
import { AuditLog } from "../models/AuditLog.js";

export const getShipments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { clearingStatus, destinationPort, search, page = 1, limit = 20 } = req.query;
    const filter: Record<string, any> = {};

    if (clearingStatus) filter.clearingStatus = clearingStatus;
    if (destinationPort) filter.destinationPort = destinationPort;
    if (search) {
      filter.$or = [
        { shipmentId: { $regex: search as string, $options: "i" } },
        { trackingNumber: { $regex: search as string, $options: "i" } },
        { bolNumber: { $regex: search as string, $options: "i" } },
        { vesselName: { $regex: search as string, $options: "i" } },
        { customsSGDNumber: { $regex: search as string, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const shipments = await ImportLogistics.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await ImportLogistics.countDocuments(filter);

    res.status(200).json(
      new ApiResponse(200, {
        shipments,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
      }, "Maritime import shipments retrieved.")
    );
  } catch (error) {
    next(error);
  }
};

export const createShipment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      trackingNumber,
      vesselName,
      voyageNumber,
      bolNumber,
      containerNumber,
      vinList,
      originPort,
      destinationPort,
      shippingLine,
      clearingAgentName,
      clearingAgentPhone,
      customsSGDNumber,
      customsDutyPaidNGN,
      terminalChargesNGN,
      departureDate,
      etaPortDate,
      notes,
    } = req.body;

    if (!trackingNumber || !vesselName || !bolNumber || !containerNumber || !departureDate || !etaPortDate) {
      throw new ApiError(400, "Tracking number, Vessel name, B/L, Container, and Departure/ETA dates are required.");
    }

    const shipmentId = `SHP-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;

    const newShipment = await ImportLogistics.create({
      shipmentId,
      trackingNumber: trackingNumber.toUpperCase().trim(),
      vesselName,
      voyageNumber,
      bolNumber: bolNumber.toUpperCase().trim(),
      containerNumber: containerNumber.toUpperCase().trim(),
      vinList: vinList || [],
      originPort: originPort || "Port of Newark / New York, USA",
      destinationPort: destinationPort || "Tin Can Island Port (TCIT)",
      shippingLine: shippingLine || "Grimaldi Lines / MSC",
      clearingAgentName: clearingAgentName || "Prestige Maritime Freight & Logistics",
      clearingAgentPhone: clearingAgentPhone || "+234 803 555 0192",
      customsSGDNumber: customsSGDNumber || "",
      customsDutyPaidNGN: Number(customsDutyPaidNGN || 0),
      terminalChargesNGN: Number(terminalChargesNGN || 0),
      departureDate,
      etaPortDate,
      notes: notes || "",
    });

    // If VINs are listed, update vehicles status to "In-Transit"
    if (vinList && Array.isArray(vinList)) {
      await Vehicle.updateMany(
        { vin: { $in: vinList.map((v: string) => v.toUpperCase().trim()) } },
        { status: "In-Transit" }
      );
    }

    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.name || "System",
      userEmail: req.user?.email || "system@dealers.com",
      userRole: req.user?.role || "imports",
      action: "IMPORT_SHIPMENT_CREATED",
      module: "IMPORTS",
      resourceId: newShipment._id.toString(),
      details: { shipmentId, bolNumber, vesselName },
    });

    res.status(201).json(new ApiResponse(201, newShipment, "Import shipment registered."));
  } catch (error) {
    next(error);
  }
};

export const updateShipmentClearingStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { clearingStatus, actualArrivalDate, gateExitDate, demurrageDaysCount, demurrageAccruedNGN, notes } = req.body;

    const shipment = await ImportLogistics.findById(id);
    if (!shipment) {
      throw new ApiError(404, "Shipment not found.");
    }

    if (clearingStatus) shipment.clearingStatus = clearingStatus;
    if (actualArrivalDate) shipment.actualArrivalDate = actualArrivalDate;
    if (gateExitDate) shipment.gateExitDate = gateExitDate;
    if (demurrageDaysCount !== undefined) shipment.demurrageDaysCount = Number(demurrageDaysCount);
    if (demurrageAccruedNGN !== undefined) shipment.demurrageAccruedNGN = Number(demurrageAccruedNGN);
    if (notes) shipment.notes = notes;

    await shipment.save();

    // If customs cleared and discharged at HQ, update vehicles to Yard Holding
    if (shipment.clearingStatus === "Received & Discharged at HQ" && shipment.vinList.length > 0) {
      await Vehicle.updateMany(
        { vin: { $in: shipment.vinList } },
        { status: "Yard Holding" }
      );
    }

    res.status(200).json(new ApiResponse(200, shipment, "Import clearing status updated."));
  } catch (error) {
    next(error);
  }
};


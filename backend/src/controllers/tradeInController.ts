import { Request, Response, NextFunction } from "express";
import { TradeInSwap } from "../models/TradeInSwap.js";
import { Vehicle } from "../models/Vehicle.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";
import { AuditLog } from "../models/AuditLog.js";

export const getTradeIns = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter: Record<string, any> = {};

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { tradeInId: { $regex: search as string, $options: "i" } },
        { customerName: { $regex: search as string, $options: "i" } },
        { "offeredVehicle.make": { $regex: search as string, $options: "i" } },
        { "offeredVehicle.modelName": { $regex: search as string, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const tradeIns = await TradeInSwap.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await TradeInSwap.countDocuments(filter);

    res.status(200).json(
      new ApiResponse(200, {
        tradeIns,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
      }, "Trade-in swap records fetched.")
    );
  } catch (error) {
    next(error);
  }
};

export const createTradeIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      offeredVehicle,
      desiredVehicleId,
      appraisalNotes,
    } = req.body;

    if (!customerName || !customerPhone || !customerEmail || !offeredVehicle?.make || !offeredVehicle?.modelName) {
      throw new ApiError(400, "Customer details and offered vehicle details are required.");
    }

    let desiredVehicleSummary;
    if (desiredVehicleId) {
      const vehicle = await Vehicle.findById(desiredVehicleId);
      if (vehicle) {
        desiredVehicleSummary = {
          vin: vehicle.vin,
          make: vehicle.make,
          modelName: vehicle.modelName,
          year: vehicle.year,
          priceNGN: vehicle.listingPriceNGN,
        };
      }
    }

    const tradeInId = `SWAP-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;

    const newTradeIn = await TradeInSwap.create({
      tradeInId,
      customerName,
      customerPhone,
      customerEmail: customerEmail.toLowerCase(),
      offeredVehicle: {
        vin: offeredVehicle.vin ? offeredVehicle.vin.toUpperCase().trim() : "",
        make: offeredVehicle.make,
        modelName: offeredVehicle.modelName,
        year: Number(offeredVehicle.year || 2018),
        mileageKm: Number(offeredVehicle.mileageKm || 0),
        condition: offeredVehicle.condition || "Nigerian Used (Clean)",
        estimatedMarketValueNGN: Number(offeredVehicle.estimatedMarketValueNGN || 0),
        appraisalOfferNGN: Number(offeredVehicle.appraisalOfferNGN || 0),
      },
      desiredVehicleId,
      desiredVehicleSummary,
      appraisalNotes: appraisalNotes || "",
    });

    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.name || "System",
      userEmail: req.user?.email || "system@dealers.com",
      userRole: req.user?.role || "tradeins",
      action: "TRADE_IN_CREATED",
      module: "TRADEINS",
      resourceId: newTradeIn._id.toString(),
      details: { tradeInId, swapDifferential: newTradeIn.swapDifferentialNGN },
    });

    res.status(201).json(new ApiResponse(201, newTradeIn, "Trade-in swap valuation submitted."));
  } catch (error) {
    next(error);
  }
};

export const updateTradeInValuation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { appraisalOfferNGN, status, appraisalNotes } = req.body;

    const tradeIn = await TradeInSwap.findById(id);
    if (!tradeIn) {
      throw new ApiError(404, "Trade-in record not found.");
    }

    if (appraisalOfferNGN !== undefined) {
      tradeIn.offeredVehicle.appraisalOfferNGN = Number(appraisalOfferNGN);
    }
    if (status) tradeIn.status = status;
    if (appraisalNotes) tradeIn.appraisalNotes = appraisalNotes;

    await tradeIn.save();

    res.status(200).json(new ApiResponse(200, tradeIn, "Trade-in appraisal valuation updated."));
  } catch (error) {
    next(error);
  }
};


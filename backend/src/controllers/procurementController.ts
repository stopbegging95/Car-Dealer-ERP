import { Request, Response, NextFunction } from "express";
import { Procurement } from "../models/Procurement.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";
import { AuditLog } from "../models/AuditLog.js";

export const getProcurements = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, purchasingMethod, search, page = 1, limit = 20 } = req.query;
    const filter: Record<string, any> = {};

    if (status) filter.approvalStatus = status;
    if (purchasingMethod) filter.purchasingMethod = purchasingMethod;
    if (search) {
      filter.$or = [
        { poNumber: { $regex: search as string, $options: "i" } },
        { vin: { $regex: search as string, $options: "i" } },
        { make: { $regex: search as string, $options: "i" } },
        { supplierName: { $regex: search as string, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const items = await Procurement.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Procurement.countDocuments(filter);

    res.status(200).json(
      new ApiResponse(200, {
        procurements: items,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
      }, "Procurement purchase orders retrieved.")
    );
  } catch (error) {
    next(error);
  }
};

export const createProcurement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      vin,
      make,
      modelName,
      year,
      countryOfOrigin,
      supplierName,
      supplierContact,
      purchasingMethod,
      purchasePriceForeign,
      foreignCurrency,
      exchangeRateNGN,
      auctionFeesNGN,
      shippingFreightNGN,
      terminalHandlingNGN,
      estimatedCustomsNGN,
      paymentTerms,
      etaPortDate,
    } = req.body;

    if (!vin || !make || !modelName || !year || !supplierName || !purchasePriceForeign) {
      throw new ApiError(400, "VIN, Make, Model, Year, Supplier, and Purchase Price are required.");
    }

    const poNumber = `PO-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;

    const newPO = await Procurement.create({
      poNumber,
      vin: vin.toUpperCase().trim(),
      make,
      modelName,
      year: Number(year),
      countryOfOrigin: countryOfOrigin || "United States",
      supplierName,
      supplierContact: supplierContact || "",
      purchasingMethod: purchasingMethod || "Copart US Auction",
      purchasePriceForeign: Number(purchasePriceForeign),
      foreignCurrency: foreignCurrency || "USD",
      exchangeRateNGN: Number(exchangeRateNGN || 1550),
      auctionFeesNGN: Number(auctionFeesNGN || 0),
      shippingFreightNGN: Number(shippingFreightNGN || 0),
      terminalHandlingNGN: Number(terminalHandlingNGN || 0),
      estimatedCustomsNGN: Number(estimatedCustomsNGN || 0),
      paymentTerms: paymentTerms || "Irrevocable Letter of Credit (L/C) 30 Days",
      etaPortDate,
      createdBy: req.user?._id,
    });

    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.name || "System",
      userEmail: req.user?.email || "system@dealers.com",
      userRole: req.user?.role || "procurement",
      action: "PROCUREMENT_PO_CREATED",
      module: "PROCUREMENT",
      resourceId: newPO._id.toString(),
      details: { poNumber: newPO.poNumber, totalLandedCost: newPO.totalEstimatedLandedCostNGN },
    });

    res.status(201).json(new ApiResponse(201, newPO, "Procurement purchase order created."));
  } catch (error) {
    next(error);
  }
};

export const approveHighValueProcurement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    const po = await Procurement.findById(id);
    if (!po) {
      throw new ApiError(404, "Purchase order not found.");
    }

    po.approvalStatus = "Approved (>₦150M Signoff)";
    po.executiveSignoffBy = req.user?._id;
    po.executiveSignoffDate = new Date();
    po.executiveRemarks = remarks || "Executive authorization granted for capital acquisition.";
    await po.save();

    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.name || "System",
      userEmail: req.user?.email || "system@dealers.com",
      userRole: req.user?.role || "admin",
      action: "PROCUREMENT_EXECUTIVE_SIGNOFF",
      module: "PROCUREMENT",
      resourceId: po._id.toString(),
      details: { poNumber: po.poNumber, cost: po.totalEstimatedLandedCostNGN },
    });

    res.status(200).json(new ApiResponse(200, po, "High-value purchase order authorized by executive."));
  } catch (error) {
    next(error);
  }
};


import { Request, Response, NextFunction } from "express";
import { PartsInventory } from "../models/PartsInventory.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";
import { AuditLog } from "../models/AuditLog.js";

export const getParts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, status, search, page = 1, limit = 20 } = req.query;
    const filter: Record<string, any> = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { sku: { $regex: search as string, $options: "i" } },
        { partName: { $regex: search as string, $options: "i" } },
        { brand: { $regex: search as string, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const parts = await PartsInventory.find(filter)
      .sort({ category: 1, partName: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await PartsInventory.countDocuments(filter);

    res.status(200).json(
      new ApiResponse(200, {
        parts,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
      }, "Parts inventory retrieved.")
    );
  } catch (error) {
    next(error);
  }
};

export const createPart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      sku,
      partName,
      category,
      brand,
      compatibleModels,
      quantityInStock,
      minThresholdAlert,
      costPriceNGN,
      sellingPriceNGN,
      aisleShelfLocation,
      supplier,
      notes,
    } = req.body;

    if (!sku || !partName || !category || !sellingPriceNGN) {
      throw new ApiError(400, "SKU, Part Name, Category, and Selling Price (NGN) are required.");
    }

    const existing = await PartsInventory.findOne({ sku: sku.toUpperCase().trim() });
    if (existing) {
      throw new ApiError(409, `A part with SKU ${sku.toUpperCase()} already exists.`);
    }

    const newPart = await PartsInventory.create({
      sku: sku.toUpperCase().trim(),
      partName,
      category,
      brand: brand || "OEM Genuine",
      compatibleModels: compatibleModels || [],
      quantityInStock: Number(quantityInStock || 0),
      minThresholdAlert: Number(minThresholdAlert || 5),
      costPriceNGN: Number(costPriceNGN || 0),
      sellingPriceNGN: Number(sellingPriceNGN),
      aisleShelfLocation: aisleShelfLocation || "Aisle A-1",
      supplier: supplier || "Authorized Distributor",
      notes: notes || "",
    });

    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.name || "System",
      userEmail: req.user?.email || "system@dealers.com",
      userRole: req.user?.role || "parts",
      action: "PART_CREATED",
      module: "PARTS",
      resourceId: newPart._id.toString(),
      details: { sku: newPart.sku, quantity: newPart.quantityInStock },
    });

    res.status(201).json(new ApiResponse(201, newPart, "Part SKU successfully recorded in parts depot."));
  } catch (error) {
    next(error);
  }
};

export const updatePartStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantityAdjustment, notes } = req.body;

    const part = await PartsInventory.findById(id);
    if (!part) {
      throw new ApiError(404, "Part SKU not found.");
    }

    part.quantityInStock += Number(quantityAdjustment || 0);
    if (notes) part.notes = `${part.notes ? part.notes + "\n" : ""}${notes}`;
    await part.save();

    res.status(200).json(new ApiResponse(200, part, "Stock quantity adjusted successfully."));
  } catch (error) {
    next(error);
  }
};


import { Request, Response, NextFunction } from "express";
import { MasterData } from "../models/MasterData.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";
import { AuditLog } from "../models/AuditLog.js";

// List all master data options for a specific category (e.g. allocation-hubs, vehicle-makes, part-categories, etc.)
export const getByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category } = req.params;
    const items = await MasterData.find({
      category: category.toLowerCase(),
      isActive: true,
    }).sort({ orderIndex: 1, label: 1 });

    res.status(200).json(
      new ApiResponse(200, items, `Master data for '${category}' retrieved successfully.`)
    );
  } catch (error) {
    next(error);
  }
};

// Get all master data records across all categories with search and category filter
export const getAllMasterData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, department, search, isActive } = req.query;
    const filter: Record<string, any> = {};

    if (category) filter.category = (category as string).toLowerCase();
    if (department) filter.department = department;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (search) {
      filter.$or = [
        { label: { $regex: search as string, $options: "i" } },
        { value: { $regex: search as string, $options: "i" } },
        { code: { $regex: search as string, $options: "i" } },
      ];
    }

    const items = await MasterData.find(filter).sort({ category: 1, orderIndex: 1, label: 1 });
    const count = await MasterData.countDocuments(filter);

    res.status(200).json(
      new ApiResponse(200, { items, count }, "All master data taxonomy retrieved.")
    );
  } catch (error) {
    next(error);
  }
};

// Create a new dropdown taxonomy option
export const createMasterDataItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, code, label, value, description, department, orderIndex, metadata } = req.body;

    if (!category || !label || !value) {
      throw new ApiError(400, "Category, label, and value are mandatory.");
    }

    const generatedCode = code ? code.toUpperCase().trim() : value.toUpperCase().replace(/\s+/g, "_").trim();

    const existing = await MasterData.findOne({
      category: category.toLowerCase().trim(),
      code: generatedCode,
    });

    if (existing) {
      throw new ApiError(409, `An option with code '${generatedCode}' already exists in category '${category}'.`);
    }

    const item = await MasterData.create({
      category: category.toLowerCase().trim(),
      code: generatedCode,
      label: label.trim(),
      value: value.trim(),
      description: description || "",
      department: department || req.user?.department || "General Operations",
      orderIndex: orderIndex ? Number(orderIndex) : 0,
      metadata: metadata || {},
      createdBy: req.user?._id,
    });

    // Audit log
    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.name || "System",
      userEmail: req.user?.email || "system@dealers.com",
      userRole: req.user?.role || "admin",
      action: "MASTER_DATA_CREATED",
      module: "MASTER_DATA",
      resourceId: item._id.toString(),
      details: { category, label, value, code: generatedCode },
    });

    res.status(201).json(new ApiResponse(201, item, "Master data option created successfully."));
  } catch (error) {
    next(error);
  }
};

// Update an existing dropdown taxonomy option
export const updateMasterDataItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { label, value, description, department, isActive, orderIndex, metadata } = req.body;

    const item = await MasterData.findById(id);
    if (!item) {
      throw new ApiError(404, "Master data entry not found.");
    }

    if (label !== undefined) item.label = label.trim();
    if (value !== undefined) item.value = value.trim();
    if (description !== undefined) item.description = description;
    if (department !== undefined) item.department = department;
    if (isActive !== undefined) item.isActive = Boolean(isActive);
    if (orderIndex !== undefined) item.orderIndex = Number(orderIndex);
    if (metadata !== undefined) item.metadata = metadata;

    await item.save();

    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.name || "System",
      userEmail: req.user?.email || "system@dealers.com",
      userRole: req.user?.role || "admin",
      action: "MASTER_DATA_UPDATED",
      module: "MASTER_DATA",
      resourceId: item._id.toString(),
      details: { category: item.category, label: item.label, value: item.value },
    });

    res.status(200).json(new ApiResponse(200, item, "Master data option updated successfully."));
  } catch (error) {
    next(error);
  }
};

// Delete a dropdown taxonomy option
export const deleteMasterDataItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await MasterData.findByIdAndDelete(id);

    if (!item) {
      throw new ApiError(404, "Master data entry not found.");
    }

    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.name || "System",
      userEmail: req.user?.email || "system@dealers.com",
      userRole: req.user?.role || "admin",
      action: "MASTER_DATA_DELETED",
      module: "MASTER_DATA",
      resourceId: id,
      details: { category: item.category, label: item.label, code: item.code },
    });

    res.status(200).json(new ApiResponse(200, null, "Master data option deleted successfully."));
  } catch (error) {
    next(error);
  }
};


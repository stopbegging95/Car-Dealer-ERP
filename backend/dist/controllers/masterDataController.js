"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMasterDataItem = exports.updateMasterDataItem = exports.createMasterDataItem = exports.getAllMasterData = exports.getByCategory = void 0;
const MasterData_js_1 = require("../models/MasterData.js");
const apiResponse_js_1 = require("../utils/apiResponse.js");
const AuditLog_js_1 = require("../models/AuditLog.js");
// List all master data options for a specific category (e.g. allocation-hubs, vehicle-makes, part-categories, etc.)
const getByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;
        const items = await MasterData_js_1.MasterData.find({
            category: category.toLowerCase(),
            isActive: true,
        }).sort({ orderIndex: 1, label: 1 });
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, items, `Master data for '${category}' retrieved successfully.`));
    }
    catch (error) {
        next(error);
    }
};
exports.getByCategory = getByCategory;
// Get all master data records across all categories with search and category filter
const getAllMasterData = async (req, res, next) => {
    try {
        const { category, department, search, isActive } = req.query;
        const filter = {};
        if (category)
            filter.category = category.toLowerCase();
        if (department)
            filter.department = department;
        if (isActive !== undefined)
            filter.isActive = isActive === "true";
        if (search) {
            filter.$or = [
                { label: { $regex: search, $options: "i" } },
                { value: { $regex: search, $options: "i" } },
                { code: { $regex: search, $options: "i" } },
            ];
        }
        const items = await MasterData_js_1.MasterData.find(filter).sort({ category: 1, orderIndex: 1, label: 1 });
        const count = await MasterData_js_1.MasterData.countDocuments(filter);
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, { items, count }, "All master data taxonomy retrieved."));
    }
    catch (error) {
        next(error);
    }
};
exports.getAllMasterData = getAllMasterData;
// Create a new dropdown taxonomy option
const createMasterDataItem = async (req, res, next) => {
    try {
        const { category, code, label, value, description, department, orderIndex, metadata } = req.body;
        if (!category || !label || !value) {
            throw new apiResponse_js_1.ApiError(400, "Category, label, and value are mandatory.");
        }
        const generatedCode = code ? code.toUpperCase().trim() : value.toUpperCase().replace(/\s+/g, "_").trim();
        const existing = await MasterData_js_1.MasterData.findOne({
            category: category.toLowerCase().trim(),
            code: generatedCode,
        });
        if (existing) {
            throw new apiResponse_js_1.ApiError(409, `An option with code '${generatedCode}' already exists in category '${category}'.`);
        }
        const item = await MasterData_js_1.MasterData.create({
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
        await AuditLog_js_1.AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.name || "System",
            userEmail: req.user?.email || "system@dealers.com",
            userRole: req.user?.role || "admin",
            action: "MASTER_DATA_CREATED",
            module: "MASTER_DATA",
            resourceId: item._id.toString(),
            details: { category, label, value, code: generatedCode },
        });
        res.status(201).json(new apiResponse_js_1.ApiResponse(201, item, "Master data option created successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.createMasterDataItem = createMasterDataItem;
// Update an existing dropdown taxonomy option
const updateMasterDataItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { label, value, description, department, isActive, orderIndex, metadata } = req.body;
        const item = await MasterData_js_1.MasterData.findById(id);
        if (!item) {
            throw new apiResponse_js_1.ApiError(404, "Master data entry not found.");
        }
        if (label !== undefined)
            item.label = label.trim();
        if (value !== undefined)
            item.value = value.trim();
        if (description !== undefined)
            item.description = description;
        if (department !== undefined)
            item.department = department;
        if (isActive !== undefined)
            item.isActive = Boolean(isActive);
        if (orderIndex !== undefined)
            item.orderIndex = Number(orderIndex);
        if (metadata !== undefined)
            item.metadata = metadata;
        await item.save();
        await AuditLog_js_1.AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.name || "System",
            userEmail: req.user?.email || "system@dealers.com",
            userRole: req.user?.role || "admin",
            action: "MASTER_DATA_UPDATED",
            module: "MASTER_DATA",
            resourceId: item._id.toString(),
            details: { category: item.category, label: item.label, value: item.value },
        });
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, item, "Master data option updated successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.updateMasterDataItem = updateMasterDataItem;
// Delete a dropdown taxonomy option
const deleteMasterDataItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await MasterData_js_1.MasterData.findByIdAndDelete(id);
        if (!item) {
            throw new apiResponse_js_1.ApiError(404, "Master data entry not found.");
        }
        await AuditLog_js_1.AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.name || "System",
            userEmail: req.user?.email || "system@dealers.com",
            userRole: req.user?.role || "admin",
            action: "MASTER_DATA_DELETED",
            module: "MASTER_DATA",
            resourceId: id,
            details: { category: item.category, label: item.label, code: item.code },
        });
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, null, "Master data option deleted successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteMasterDataItem = deleteMasterDataItem;

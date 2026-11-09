"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePartStock = exports.createPart = exports.getParts = void 0;
const PartsInventory_js_1 = require("../models/PartsInventory.js");
const apiResponse_js_1 = require("../utils/apiResponse.js");
const AuditLog_js_1 = require("../models/AuditLog.js");
const getParts = async (req, res, next) => {
    try {
        const { category, status, search, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (category)
            filter.category = category;
        if (status)
            filter.status = status;
        if (search) {
            filter.$or = [
                { sku: { $regex: search, $options: "i" } },
                { partName: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const parts = await PartsInventory_js_1.PartsInventory.find(filter)
            .sort({ category: 1, partName: 1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await PartsInventory_js_1.PartsInventory.countDocuments(filter);
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, {
            parts,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                limit: Number(limit),
            },
        }, "Parts inventory retrieved."));
    }
    catch (error) {
        next(error);
    }
};
exports.getParts = getParts;
const createPart = async (req, res, next) => {
    try {
        const { sku, partName, category, brand, compatibleModels, quantityInStock, minThresholdAlert, costPriceNGN, sellingPriceNGN, aisleShelfLocation, supplier, notes, } = req.body;
        if (!sku || !partName || !category || !sellingPriceNGN) {
            throw new apiResponse_js_1.ApiError(400, "SKU, Part Name, Category, and Selling Price (NGN) are required.");
        }
        const existing = await PartsInventory_js_1.PartsInventory.findOne({ sku: sku.toUpperCase().trim() });
        if (existing) {
            throw new apiResponse_js_1.ApiError(409, `A part with SKU ${sku.toUpperCase()} already exists.`);
        }
        const newPart = await PartsInventory_js_1.PartsInventory.create({
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
        await AuditLog_js_1.AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.name || "System",
            userEmail: req.user?.email || "system@dealers.com",
            userRole: req.user?.role || "parts",
            action: "PART_CREATED",
            module: "PARTS",
            resourceId: newPart._id.toString(),
            details: { sku: newPart.sku, quantity: newPart.quantityInStock },
        });
        res.status(201).json(new apiResponse_js_1.ApiResponse(201, newPart, "Part SKU successfully recorded in parts depot."));
    }
    catch (error) {
        next(error);
    }
};
exports.createPart = createPart;
const updatePartStock = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantityAdjustment, notes } = req.body;
        const part = await PartsInventory_js_1.PartsInventory.findById(id);
        if (!part) {
            throw new apiResponse_js_1.ApiError(404, "Part SKU not found.");
        }
        part.quantityInStock += Number(quantityAdjustment || 0);
        if (notes)
            part.notes = `${part.notes ? part.notes + "\n" : ""}${notes}`;
        await part.save();
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, part, "Stock quantity adjusted successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.updatePartStock = updatePartStock;

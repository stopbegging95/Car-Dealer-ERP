"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVehicleTelemetry = exports.deleteVehicle = exports.updateVehicleStatus = exports.updateVehicle = exports.createVehicle = exports.getVehicleById = exports.getVehicles = void 0;
const Vehicle_js_1 = require("../models/Vehicle.js");
const apiResponse_js_1 = require("../utils/apiResponse.js");
const AuditLog_js_1 = require("../models/AuditLog.js");
// List all vehicles with enterprise filters (status, category, condition, price range, hub, pagination)
const getVehicles = async (req, res, next) => {
    try {
        const { status, category, condition, make, modelName, minPrice, maxPrice, currentHub, qaStatus, search, page = 1, limit = 20, sortBy = "createdAt", sortOrder = "desc", } = req.query;
        const filter = {};
        if (status)
            filter.status = status;
        if (category)
            filter.category = category;
        if (condition)
            filter.condition = condition;
        if (make)
            filter.make = { $regex: make, $options: "i" };
        if (modelName)
            filter.modelName = { $regex: modelName, $options: "i" };
        if (currentHub)
            filter.currentHub = currentHub;
        if (qaStatus)
            filter.qaStatus = qaStatus;
        if (minPrice || maxPrice) {
            filter.listingPriceNGN = {};
            if (minPrice)
                filter.listingPriceNGN.$gte = Number(minPrice);
            if (maxPrice)
                filter.listingPriceNGN.$lte = Number(maxPrice);
        }
        if (search) {
            filter.$or = [
                { make: { $regex: search, $options: "i" } },
                { modelName: { $regex: search, $options: "i" } },
                { vin: { $regex: search, $options: "i" } },
                { stockId: { $regex: search, $options: "i" } },
            ];
        }
        const sortDirection = sortOrder === "asc" ? 1 : -1;
        const sortOptions = { [sortBy]: sortDirection };
        const skip = (Number(page) - 1) * Number(limit);
        const vehicles = await Vehicle_js_1.Vehicle.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit));
        const total = await Vehicle_js_1.Vehicle.countDocuments(filter);
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, {
            vehicles,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                limit: Number(limit),
            },
        }, "Vehicles inventory fetched successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.getVehicles = getVehicles;
// Get single vehicle by ID or VIN or Stock ID
const getVehicleById = async (req, res, next) => {
    try {
        const { identifier } = req.params;
        let vehicle;
        if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
            vehicle = await Vehicle_js_1.Vehicle.findById(identifier);
        }
        else {
            vehicle = await Vehicle_js_1.Vehicle.findOne({
                $or: [{ vin: identifier.toUpperCase() }, { stockId: identifier.toUpperCase() }],
            });
        }
        if (!vehicle) {
            throw new apiResponse_js_1.ApiError(404, "Vehicle not found in dealership records.");
        }
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, vehicle, "Vehicle details retrieved successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.getVehicleById = getVehicleById;
// Create a new vehicle stock record
const createVehicle = async (req, res, next) => {
    try {
        const { vin, stockId, make, modelName, year, trim, category, bodyType, exteriorColor, interiorColor, transmission, fuelType, engineCapacity, mileageKm, condition, status, acquisitionCostNGN, customsDutyNGN, clearingCostNGN, reconCostNGN, listingPriceNGN, minAcceptablePriceNGN, images, thumbnail, videoUrl, virtualTour360Url, currentHub, bayNumber, branchLocation, qaStatus, inspectionScore, customsDeclarationNumber, titleStatus, features, specifications, notes, } = req.body;
        if (!vin || !make || !modelName || !year || !listingPriceNGN) {
            throw new apiResponse_js_1.ApiError(400, "VIN, Make, Model, Year, and Listing Price (NGN) are required.");
        }
        const existingVin = await Vehicle_js_1.Vehicle.findOne({ vin: vin.toUpperCase().trim() });
        if (existingVin) {
            throw new apiResponse_js_1.ApiError(409, `A vehicle with VIN ${vin.toUpperCase()} already exists.`);
        }
        const generatedStockId = stockId
            ? stockId.toUpperCase().trim()
            : `STK-${year}-${make.substring(0, 3).toUpperCase()}-${Date.now().toString(36).substring(4).toUpperCase()}`;
        const newVehicle = await Vehicle_js_1.Vehicle.create({
            vin: vin.toUpperCase().trim(),
            stockId: generatedStockId,
            make,
            modelName,
            year: Number(year),
            trim: trim || "",
            category: category || "Luxury SUV",
            bodyType: bodyType || "SUV",
            exteriorColor: exteriorColor || "Obsidian Black",
            interiorColor: interiorColor || "Cognac Brown Leather",
            transmission: transmission || "Automatic",
            fuelType: fuelType || "Petrol",
            engineCapacity: engineCapacity || "",
            mileageKm: Number(mileageKm || 0),
            condition: condition || "Foreign Used (Tokunbo)",
            status: status || "Showroom Ready",
            acquisitionCostNGN: Number(acquisitionCostNGN || 0),
            customsDutyNGN: Number(customsDutyNGN || 0),
            clearingCostNGN: Number(clearingCostNGN || 0),
            reconCostNGN: Number(reconCostNGN || 0),
            listingPriceNGN: Number(listingPriceNGN),
            minAcceptablePriceNGN: Number(minAcceptablePriceNGN || 0),
            images: images || [],
            thumbnail: thumbnail || (images && images.length ? images[0] : undefined),
            videoUrl,
            virtualTour360Url,
            currentHub: currentHub || "Victoria Island HQ, Lagos",
            bayNumber: bayNumber || "Bay 01",
            branchLocation: branchLocation || "Lagos Main Showroom",
            qaStatus: qaStatus || "Passed",
            inspectionScore: inspectionScore ? Number(inspectionScore) : 98,
            customsDeclarationNumber: customsDeclarationNumber || "",
            titleStatus: titleStatus || "Original Customs SGD",
            features: features || [],
            specifications: specifications || {},
            notes: notes || "",
            createdBy: req.user?._id,
        });
        await AuditLog_js_1.AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.name || "System",
            userEmail: req.user?.email || "system@dealers.com",
            userRole: req.user?.role || "admin",
            action: "VEHICLE_CREATED",
            module: "INVENTORY",
            resourceId: newVehicle._id.toString(),
            details: { vin: newVehicle.vin, stockId: newVehicle.stockId, price: newVehicle.listingPriceNGN },
        });
        res.status(201).json(new apiResponse_js_1.ApiResponse(201, newVehicle, "Vehicle successfully added to inventory."));
    }
    catch (error) {
        next(error);
    }
};
exports.createVehicle = createVehicle;
// Update vehicle stock record
const updateVehicle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body, updatedBy: req.user?._id };
        if (updateData.vin)
            updateData.vin = updateData.vin.toUpperCase().trim();
        if (updateData.stockId)
            updateData.stockId = updateData.stockId.toUpperCase().trim();
        const vehicle = await Vehicle_js_1.Vehicle.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!vehicle) {
            throw new apiResponse_js_1.ApiError(404, "Vehicle not found.");
        }
        await AuditLog_js_1.AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.name || "System",
            userEmail: req.user?.email || "system@dealers.com",
            userRole: req.user?.role || "admin",
            action: "VEHICLE_UPDATED",
            module: "INVENTORY",
            resourceId: vehicle._id.toString(),
            details: { vin: vehicle.vin, status: vehicle.status, listingPrice: vehicle.listingPriceNGN },
        });
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, vehicle, "Vehicle updated successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.updateVehicle = updateVehicle;
// Transition vehicle lifecycle status
const updateVehicleStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;
        if (!status) {
            throw new apiResponse_js_1.ApiError(400, "Lifecycle status is required.");
        }
        const vehicle = await Vehicle_js_1.Vehicle.findById(id);
        if (!vehicle) {
            throw new apiResponse_js_1.ApiError(404, "Vehicle not found.");
        }
        const previousStatus = vehicle.status;
        vehicle.status = status;
        if (remarks) {
            vehicle.notes = `${vehicle.notes ? vehicle.notes + "\n" : ""}[${new Date().toISOString()}] Status changed from ${previousStatus} to ${status}: ${remarks}`;
        }
        await vehicle.save();
        await AuditLog_js_1.AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.name || "System",
            userEmail: req.user?.email || "system@dealers.com",
            userRole: req.user?.role || "admin",
            action: "VEHICLE_STATUS_TRANSITION",
            module: "INVENTORY",
            resourceId: vehicle._id.toString(),
            details: { previousStatus, newStatus: status, remarks },
        });
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, vehicle, `Vehicle status transitioned to '${status}'.`));
    }
    catch (error) {
        next(error);
    }
};
exports.updateVehicleStatus = updateVehicleStatus;
// Delete vehicle from stock
const deleteVehicle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle_js_1.Vehicle.findByIdAndDelete(id);
        if (!vehicle) {
            throw new apiResponse_js_1.ApiError(404, "Vehicle not found.");
        }
        await AuditLog_js_1.AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.name || "System",
            userEmail: req.user?.email || "system@dealers.com",
            userRole: req.user?.role || "admin",
            action: "VEHICLE_DELETED",
            module: "INVENTORY",
            resourceId: id,
            details: { vin: vehicle.vin, stockId: vehicle.stockId },
        });
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, null, "Vehicle removed from dealership system."));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteVehicle = deleteVehicle;
// Telemetry & metrics for inventory
const getVehicleTelemetry = async (req, res, next) => {
    try {
        const totalVehicles = await Vehicle_js_1.Vehicle.countDocuments();
        const showroomReadyCount = await Vehicle_js_1.Vehicle.countDocuments({ status: "Showroom Ready" });
        const inTransitCount = await Vehicle_js_1.Vehicle.countDocuments({ status: "In-Transit" });
        const reconCount = await Vehicle_js_1.Vehicle.countDocuments({ status: "Recon & Detailing" });
        const customsCount = await Vehicle_js_1.Vehicle.countDocuments({ status: "Customs Clearing" });
        const soldCount = await Vehicle_js_1.Vehicle.countDocuments({ status: "Sold" });
        const totalValueAgg = await Vehicle_js_1.Vehicle.aggregate([
            { $match: { status: { $ne: "Sold" } } },
            { $group: { _id: null, totalValueNGN: { $sum: "$listingPriceNGN" } } },
        ]);
        const totalInventoryValueNGN = totalValueAgg.length > 0 ? totalValueAgg[0].totalValueNGN : 0;
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, {
            totalVehicles,
            showroomReadyCount,
            inTransitCount,
            reconCount,
            customsCount,
            soldCount,
            totalInventoryValueNGN,
        }, "Inventory telemetry metrics loaded."));
    }
    catch (error) {
        next(error);
    }
};
exports.getVehicleTelemetry = getVehicleTelemetry;

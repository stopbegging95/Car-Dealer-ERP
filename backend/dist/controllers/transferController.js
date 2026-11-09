"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acknowledgeTransferReceipt = exports.createTransfer = exports.getTransfers = void 0;
const BranchTransfer_js_1 = require("../models/BranchTransfer.js");
const Vehicle_js_1 = require("../models/Vehicle.js");
const apiResponse_js_1 = require("../utils/apiResponse.js");
const AuditLog_js_1 = require("../models/AuditLog.js");
const getTransfers = async (req, res, next) => {
    try {
        const { status, sourceHub, destinationHub, search, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (status)
            filter.status = status;
        if (sourceHub)
            filter.sourceHub = sourceHub;
        if (destinationHub)
            filter.destinationHub = destinationHub;
        if (search) {
            filter.$or = [
                { transferId: { $regex: search, $options: "i" } },
                { waybillNumber: { $regex: search, $options: "i" } },
                { vin: { $regex: search, $options: "i" } },
                { truckPlateNumber: { $regex: search, $options: "i" } },
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const transfers = await BranchTransfer_js_1.BranchTransfer.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await BranchTransfer_js_1.BranchTransfer.countDocuments(filter);
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, {
            transfers,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                limit: Number(limit),
            },
        }, "Inter-hub transfers and waybills retrieved."));
    }
    catch (error) {
        next(error);
    }
};
exports.getTransfers = getTransfers;
const createTransfer = async (req, res, next) => {
    try {
        const { vehicleId, vin, sourceHub, destinationHub, carrierDriverName, carrierDriverPhone, truckPlateNumber, estimatedArrivalTime, notes, } = req.body;
        if (!vehicleId || !vin || !sourceHub || !destinationHub || !carrierDriverName || !truckPlateNumber) {
            throw new apiResponse_js_1.ApiError(400, "Vehicle details, route hubs, carrier driver, and truck plate are required.");
        }
        const vehicle = await Vehicle_js_1.Vehicle.findById(vehicleId);
        if (!vehicle) {
            throw new apiResponse_js_1.ApiError(404, "Vehicle not found.");
        }
        const transferId = `TRF-${Date.now().toString(36).toUpperCase()}`;
        const waybillNumber = `WB-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
        const newTransfer = await BranchTransfer_js_1.BranchTransfer.create({
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
        await AuditLog_js_1.AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.name || "System",
            userEmail: req.user?.email || "system@dealers.com",
            userRole: req.user?.role || "operations",
            action: "BRANCH_TRANSFER_DISPATCHED",
            module: "LOGISTICS",
            resourceId: newTransfer._id.toString(),
            details: { waybillNumber, vin, from: sourceHub, to: destinationHub },
        });
        res.status(201).json(new apiResponse_js_1.ApiResponse(201, newTransfer, "Transfer waybill generated."));
    }
    catch (error) {
        next(error);
    }
};
exports.createTransfer = createTransfer;
const acknowledgeTransferReceipt = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;
        const transfer = await BranchTransfer_js_1.BranchTransfer.findById(id);
        if (!transfer) {
            throw new apiResponse_js_1.ApiError(404, "Transfer not found.");
        }
        transfer.status = "Delivered & Received";
        transfer.actualArrivalTime = new Date();
        transfer.receivingSignoffBy = req.user?.name || "Receiving Hub Yard Master";
        if (notes)
            transfer.notes = `${transfer.notes ? transfer.notes + "\n" : ""}${notes}`;
        await transfer.save();
        // Update vehicle's current hub
        await Vehicle_js_1.Vehicle.findByIdAndUpdate(transfer.vehicleId, {
            currentHub: transfer.destinationHub,
        });
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, transfer, `Vehicle received at ${transfer.destinationHub}.`));
    }
    catch (error) {
        next(error);
    }
};
exports.acknowledgeTransferReceipt = acknowledgeTransferReceipt;

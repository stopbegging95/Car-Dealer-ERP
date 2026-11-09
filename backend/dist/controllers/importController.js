"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShipmentClearingStatus = exports.createShipment = exports.getShipments = void 0;
const ImportLogistics_js_1 = require("../models/ImportLogistics.js");
const Vehicle_js_1 = require("../models/Vehicle.js");
const apiResponse_js_1 = require("../utils/apiResponse.js");
const AuditLog_js_1 = require("../models/AuditLog.js");
const getShipments = async (req, res, next) => {
    try {
        const { clearingStatus, destinationPort, search, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (clearingStatus)
            filter.clearingStatus = clearingStatus;
        if (destinationPort)
            filter.destinationPort = destinationPort;
        if (search) {
            filter.$or = [
                { shipmentId: { $regex: search, $options: "i" } },
                { trackingNumber: { $regex: search, $options: "i" } },
                { bolNumber: { $regex: search, $options: "i" } },
                { vesselName: { $regex: search, $options: "i" } },
                { customsSGDNumber: { $regex: search, $options: "i" } },
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const shipments = await ImportLogistics_js_1.ImportLogistics.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await ImportLogistics_js_1.ImportLogistics.countDocuments(filter);
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, {
            shipments,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                limit: Number(limit),
            },
        }, "Maritime import shipments retrieved."));
    }
    catch (error) {
        next(error);
    }
};
exports.getShipments = getShipments;
const createShipment = async (req, res, next) => {
    try {
        const { trackingNumber, vesselName, voyageNumber, bolNumber, containerNumber, vinList, originPort, destinationPort, shippingLine, clearingAgentName, clearingAgentPhone, customsSGDNumber, customsDutyPaidNGN, terminalChargesNGN, departureDate, etaPortDate, notes, } = req.body;
        if (!trackingNumber || !vesselName || !bolNumber || !containerNumber || !departureDate || !etaPortDate) {
            throw new apiResponse_js_1.ApiError(400, "Tracking number, Vessel name, B/L, Container, and Departure/ETA dates are required.");
        }
        const shipmentId = `SHP-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
        const newShipment = await ImportLogistics_js_1.ImportLogistics.create({
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
            await Vehicle_js_1.Vehicle.updateMany({ vin: { $in: vinList.map((v) => v.toUpperCase().trim()) } }, { status: "In-Transit" });
        }
        await AuditLog_js_1.AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.name || "System",
            userEmail: req.user?.email || "system@dealers.com",
            userRole: req.user?.role || "imports",
            action: "IMPORT_SHIPMENT_CREATED",
            module: "IMPORTS",
            resourceId: newShipment._id.toString(),
            details: { shipmentId, bolNumber, vesselName },
        });
        res.status(201).json(new apiResponse_js_1.ApiResponse(201, newShipment, "Import shipment registered."));
    }
    catch (error) {
        next(error);
    }
};
exports.createShipment = createShipment;
const updateShipmentClearingStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { clearingStatus, actualArrivalDate, gateExitDate, demurrageDaysCount, demurrageAccruedNGN, notes } = req.body;
        const shipment = await ImportLogistics_js_1.ImportLogistics.findById(id);
        if (!shipment) {
            throw new apiResponse_js_1.ApiError(404, "Shipment not found.");
        }
        if (clearingStatus)
            shipment.clearingStatus = clearingStatus;
        if (actualArrivalDate)
            shipment.actualArrivalDate = actualArrivalDate;
        if (gateExitDate)
            shipment.gateExitDate = gateExitDate;
        if (demurrageDaysCount !== undefined)
            shipment.demurrageDaysCount = Number(demurrageDaysCount);
        if (demurrageAccruedNGN !== undefined)
            shipment.demurrageAccruedNGN = Number(demurrageAccruedNGN);
        if (notes)
            shipment.notes = notes;
        await shipment.save();
        // If customs cleared and discharged at HQ, update vehicles to Yard Holding
        if (shipment.clearingStatus === "Received & Discharged at HQ" && shipment.vinList.length > 0) {
            await Vehicle_js_1.Vehicle.updateMany({ vin: { $in: shipment.vinList } }, { status: "Yard Holding" });
        }
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, shipment, "Import clearing status updated."));
    }
    catch (error) {
        next(error);
    }
};
exports.updateShipmentClearingStatus = updateShipmentClearingStatus;

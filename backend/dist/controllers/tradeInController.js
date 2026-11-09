"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTradeInValuation = exports.createTradeIn = exports.getTradeIns = void 0;
const TradeInSwap_js_1 = require("../models/TradeInSwap.js");
const Vehicle_js_1 = require("../models/Vehicle.js");
const apiResponse_js_1 = require("../utils/apiResponse.js");
const AuditLog_js_1 = require("../models/AuditLog.js");
const getTradeIns = async (req, res, next) => {
    try {
        const { status, search, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (status)
            filter.status = status;
        if (search) {
            filter.$or = [
                { tradeInId: { $regex: search, $options: "i" } },
                { customerName: { $regex: search, $options: "i" } },
                { "offeredVehicle.make": { $regex: search, $options: "i" } },
                { "offeredVehicle.modelName": { $regex: search, $options: "i" } },
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const tradeIns = await TradeInSwap_js_1.TradeInSwap.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await TradeInSwap_js_1.TradeInSwap.countDocuments(filter);
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, {
            tradeIns,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                limit: Number(limit),
            },
        }, "Trade-in swap records fetched."));
    }
    catch (error) {
        next(error);
    }
};
exports.getTradeIns = getTradeIns;
const createTradeIn = async (req, res, next) => {
    try {
        const { customerName, customerPhone, customerEmail, offeredVehicle, desiredVehicleId, appraisalNotes, } = req.body;
        if (!customerName || !customerPhone || !customerEmail || !offeredVehicle?.make || !offeredVehicle?.modelName) {
            throw new apiResponse_js_1.ApiError(400, "Customer details and offered vehicle details are required.");
        }
        let desiredVehicleSummary;
        if (desiredVehicleId) {
            const vehicle = await Vehicle_js_1.Vehicle.findById(desiredVehicleId);
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
        const newTradeIn = await TradeInSwap_js_1.TradeInSwap.create({
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
        await AuditLog_js_1.AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.name || "System",
            userEmail: req.user?.email || "system@dealers.com",
            userRole: req.user?.role || "tradeins",
            action: "TRADE_IN_CREATED",
            module: "TRADEINS",
            resourceId: newTradeIn._id.toString(),
            details: { tradeInId, swapDifferential: newTradeIn.swapDifferentialNGN },
        });
        res.status(201).json(new apiResponse_js_1.ApiResponse(201, newTradeIn, "Trade-in swap valuation submitted."));
    }
    catch (error) {
        next(error);
    }
};
exports.createTradeIn = createTradeIn;
const updateTradeInValuation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { appraisalOfferNGN, status, appraisalNotes } = req.body;
        const tradeIn = await TradeInSwap_js_1.TradeInSwap.findById(id);
        if (!tradeIn) {
            throw new apiResponse_js_1.ApiError(404, "Trade-in record not found.");
        }
        if (appraisalOfferNGN !== undefined) {
            tradeIn.offeredVehicle.appraisalOfferNGN = Number(appraisalOfferNGN);
        }
        if (status)
            tradeIn.status = status;
        if (appraisalNotes)
            tradeIn.appraisalNotes = appraisalNotes;
        await tradeIn.save();
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, tradeIn, "Trade-in appraisal valuation updated."));
    }
    catch (error) {
        next(error);
    }
};
exports.updateTradeInValuation = updateTradeInValuation;

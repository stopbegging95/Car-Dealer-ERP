"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrder = exports.createOrder = exports.getOrderById = exports.getOrders = void 0;
const Order_js_1 = require("../models/Order.js");
const Vehicle_js_1 = require("../models/Vehicle.js");
const apiResponse_js_1 = require("../utils/apiResponse.js");
const AuditLog_js_1 = require("../models/AuditLog.js");
// List all sales orders with filters (stage, paymentStatus, salesRep, search)
const getOrders = async (req, res, next) => {
    try {
        const { stage, paymentStatus, search, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (stage)
            filter.stage = stage;
        if (paymentStatus)
            filter.paymentStatus = paymentStatus;
        if (search) {
            filter.$or = [
                { orderNumber: { $regex: search, $options: "i" } },
                { customerName: { $regex: search, $options: "i" } },
                { customerEmail: { $regex: search, $options: "i" } },
                { "vehicleSummary.vin": { $regex: search, $options: "i" } },
            ];
        }
        // Non-admin staff or customers may be scoped
        if (req.user?.role === "customer") {
            filter.customerId = req.user._id;
        }
        const skip = (Number(page) - 1) * Number(limit);
        const orders = await Order_js_1.Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await Order_js_1.Order.countDocuments(filter);
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, {
            orders,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                limit: Number(limit),
            },
        }, "Orders retrieved successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.getOrders = getOrders;
// Get single order by ID or Order Number
const getOrderById = async (req, res, next) => {
    try {
        const { identifier } = req.params;
        let order;
        if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
            order = await Order_js_1.Order.findById(identifier);
        }
        else {
            order = await Order_js_1.Order.findOne({ orderNumber: identifier.toUpperCase() });
        }
        if (!order) {
            throw new apiResponse_js_1.ApiError(404, "Order not found.");
        }
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, order, "Order retrieved successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.getOrderById = getOrderById;
// Create a new sales order or quotation
const createOrder = async (req, res, next) => {
    try {
        const { customerId, customerName, customerEmail, customerPhone, customerAddress, vehicleId, salesRepName, registrationFeesNGN, accessoriesTotalNGN, discountAmountNGN, depositAmountNGN, paymentMethod, deliveryDetails, notes, } = req.body;
        if (!customerName || !customerEmail || !customerPhone || !vehicleId) {
            throw new apiResponse_js_1.ApiError(400, "Customer contact details and Vehicle ID are required.");
        }
        const vehicle = await Vehicle_js_1.Vehicle.findById(vehicleId);
        if (!vehicle) {
            throw new apiResponse_js_1.ApiError(404, "Selected vehicle not found in inventory.");
        }
        const generatedOrderNumber = `ORD-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;
        const newOrder = await Order_js_1.Order.create({
            orderNumber: generatedOrderNumber,
            customerId: customerId || req.user?._id,
            customerName,
            customerEmail: customerEmail.toLowerCase(),
            customerPhone,
            customerAddress: customerAddress || "",
            vehicleId: vehicle._id,
            vehicleSummary: {
                vin: vehicle.vin,
                stockId: vehicle.stockId,
                make: vehicle.make,
                modelName: vehicle.modelName,
                year: vehicle.year,
                listingPriceNGN: vehicle.listingPriceNGN,
            },
            salesRepId: req.user?._id,
            salesRepName: salesRepName || req.user?.name || "Executive Sales Desk",
            vehiclePriceNGN: vehicle.listingPriceNGN,
            registrationFeesNGN: Number(registrationFeesNGN || 0),
            accessoriesTotalNGN: Number(accessoriesTotalNGN || 0),
            discountAmountNGN: Number(discountAmountNGN || 0),
            totalAmountNGN: vehicle.listingPriceNGN, // will recalculate in pre-save
            depositAmountNGN: Number(depositAmountNGN || 0),
            paymentMethod: paymentMethod || "Bank Wire / NIBSS",
            deliveryDetails: deliveryDetails || { hubLocation: vehicle.currentHub },
            notes: notes || "",
        });
        // Mark vehicle reserved if order is created
        vehicle.status = "Reserved";
        await vehicle.save();
        await AuditLog_js_1.AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.name || "System",
            userEmail: req.user?.email || "system@dealers.com",
            userRole: req.user?.role || "sales",
            action: "ORDER_CREATED",
            module: "SALES",
            resourceId: newOrder._id.toString(),
            details: { orderNumber: newOrder.orderNumber, vehicleVin: vehicle.vin, total: newOrder.totalAmountNGN },
        });
        res.status(201).json(new apiResponse_js_1.ApiResponse(201, newOrder, "Sales order created successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.createOrder = createOrder;
// Update order stage or payment
const updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { stage, paymentStatus, depositAmountNGN, deliveryDetails, notes } = req.body;
        const order = await Order_js_1.Order.findById(id);
        if (!order) {
            throw new apiResponse_js_1.ApiError(404, "Order not found.");
        }
        if (stage)
            order.stage = stage;
        if (paymentStatus)
            order.paymentStatus = paymentStatus;
        if (depositAmountNGN !== undefined)
            order.depositAmountNGN = Number(depositAmountNGN);
        if (deliveryDetails)
            order.deliveryDetails = { ...order.deliveryDetails, ...deliveryDetails };
        if (notes)
            order.notes = notes;
        // If order delivered, update vehicle status to "Delivered"
        if (stage === "Delivered & Closed") {
            await Vehicle_js_1.Vehicle.findByIdAndUpdate(order.vehicleId, { status: "Delivered" });
        }
        await order.save();
        await AuditLog_js_1.AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.name || "System",
            userEmail: req.user?.email || "system@dealers.com",
            userRole: req.user?.role || "sales",
            action: "ORDER_UPDATED",
            module: "SALES",
            resourceId: order._id.toString(),
            details: { orderNumber: order.orderNumber, stage: order.stage, paymentStatus: order.paymentStatus },
        });
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, order, "Order updated successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.updateOrder = updateOrder;

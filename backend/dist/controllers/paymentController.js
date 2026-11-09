"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePaystackWebhook = exports.verifyPaystack = exports.initializePaystack = void 0;
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const env_js_1 = require("../config/env.js");
const Order_js_1 = require("../models/Order.js");
const apiResponse_js_1 = require("../utils/apiResponse.js");
const AuditLog_js_1 = require("../models/AuditLog.js");
// Initialize Paystack Payment
const initializePaystack = async (req, res, next) => {
    try {
        const { orderId, email, amountNGN, callbackUrl } = req.body;
        if (!orderId || !email || !amountNGN) {
            throw new apiResponse_js_1.ApiError(400, "Order ID, customer email, and amount in NGN are required.");
        }
        const order = await Order_js_1.Order.findById(orderId);
        if (!order) {
            throw new apiResponse_js_1.ApiError(404, "Order not found.");
        }
        const amountInKobo = Math.round(Number(amountNGN) * 100);
        // Call Paystack API
        const paystackResponse = await axios_1.default.post(`${env_js_1.config.paystack.baseUrl}/transaction/initialize`, {
            email,
            amount: amountInKobo,
            callback_url: callbackUrl || `${env_js_1.config.frontendUrl}/checkout/verify`,
            metadata: {
                orderId: order._id.toString(),
                orderNumber: order.orderNumber,
                customerName: order.customerName,
            },
        }, {
            headers: {
                Authorization: `Bearer ${env_js_1.config.paystack.secretKey}`,
                "Content-Type": "application/json",
            },
        });
        const data = paystackResponse.data.data;
        // Attach reference to order
        order.paystackReference = data.reference;
        await order.save();
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, {
            authorizationUrl: data.authorization_url,
            accessCode: data.access_code,
            reference: data.reference,
        }, "Paystack transaction initialized successfully."));
    }
    catch (error) {
        if (error.response?.data?.message) {
            next(new apiResponse_js_1.ApiError(error.response.status || 500, error.response.data.message));
        }
        else {
            next(error);
        }
    }
};
exports.initializePaystack = initializePaystack;
// Verify Paystack Reference
const verifyPaystack = async (req, res, next) => {
    try {
        const { reference } = req.params;
        if (!reference) {
            throw new apiResponse_js_1.ApiError(400, "Transaction reference is required.");
        }
        const paystackResponse = await axios_1.default.get(`${env_js_1.config.paystack.baseUrl}/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${env_js_1.config.paystack.secretKey}`,
            },
        });
        const data = paystackResponse.data.data;
        if (data.status === "success") {
            const orderId = data.metadata?.orderId;
            if (orderId) {
                const order = await Order_js_1.Order.findById(orderId);
                if (order) {
                    const paidAmountNGN = data.amount / 100;
                    order.depositAmountNGN += paidAmountNGN;
                    order.transactions.push({
                        reference: data.reference,
                        amountNGN: paidAmountNGN,
                        date: new Date(),
                        method: "Paystack Online Card",
                        status: "Success",
                        channel: data.channel,
                    });
                    await order.save();
                }
            }
        }
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, data, "Transaction verified successfully."));
    }
    catch (error) {
        if (error.response?.data?.message) {
            next(new apiResponse_js_1.ApiError(error.response.status || 500, error.response.data.message));
        }
        else {
            next(error);
        }
    }
};
exports.verifyPaystack = verifyPaystack;
// Paystack Webhook Handler with HMAC SHA512 Verification
const handlePaystackWebhook = async (req, res) => {
    try {
        const hash = crypto_1.default
            .createHmac("sha512", env_js_1.config.paystack.secretKey)
            .update(JSON.stringify(req.body))
            .digest("hex");
        if (hash !== req.headers["x-paystack-signature"]) {
            res.status(400).send("Invalid Paystack Signature");
            return;
        }
        const event = req.body;
        if (event.event === "charge.success") {
            const { reference, amount, metadata } = event.data;
            const orderId = metadata?.orderId;
            if (orderId) {
                const order = await Order_js_1.Order.findById(orderId);
                if (order) {
                    const amountNGN = amount / 100;
                    order.depositAmountNGN += amountNGN;
                    order.transactions.push({
                        reference,
                        amountNGN,
                        date: new Date(),
                        method: "Paystack Online Card",
                        status: "Success",
                    });
                    await order.save();
                    await AuditLog_js_1.AuditLog.create({
                        action: "PAYSTACK_PAYMENT_CONFIRMED",
                        module: "PAYMENT",
                        resourceId: orderId,
                        details: { reference, amountNGN },
                    });
                }
            }
        }
        res.sendStatus(200);
    }
    catch (error) {
        res.sendStatus(500);
    }
};
exports.handlePaystackWebhook = handlePaystackWebhook;

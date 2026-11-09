"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addClientInquiryOrTicket = exports.createCRMClient = exports.getCRMClients = void 0;
const CRMClient_js_1 = require("../models/CRMClient.js");
const apiResponse_js_1 = require("../utils/apiResponse.js");
const AuditLog_js_1 = require("../models/AuditLog.js");
const getCRMClients = async (req, res, next) => {
    try {
        const { tier, search, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (tier)
            filter.tier = tier;
        if (search) {
            filter.$or = [
                { fullName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { companyName: { $regex: search, $options: "i" } },
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const clients = await CRMClient_js_1.CRMClient.find(filter)
            .sort({ lifetimeSpendNGN: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await CRMClient_js_1.CRMClient.countDocuments(filter);
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, {
            clients,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                limit: Number(limit),
            },
        }, "CRM VIP private clients retrieved."));
    }
    catch (error) {
        next(error);
    }
};
exports.getCRMClients = getCRMClients;
const createCRMClient = async (req, res, next) => {
    try {
        const { fullName, email, phone, companyName, tier, preferredBrands, relationshipManagerName } = req.body;
        if (!fullName || !email || !phone) {
            throw new apiResponse_js_1.ApiError(400, "Full name, email, and phone are required.");
        }
        const clientId = `VIP-${Date.now().toString(36).toUpperCase()}`;
        const newClient = await CRMClient_js_1.CRMClient.create({
            clientId,
            fullName,
            email: email.toLowerCase(),
            phone,
            companyName: companyName || "",
            tier: tier || "Standard",
            preferredBrands: preferredBrands || ["Mercedes-Benz", "Land Rover"],
            relationshipManagerName: relationshipManagerName || req.user?.name || "VIP Private Client Executive",
        });
        await AuditLog_js_1.AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.name || "System",
            userEmail: req.user?.email || "system@dealers.com",
            userRole: req.user?.role || "crm",
            action: "CRM_CLIENT_CREATED",
            module: "CRM",
            resourceId: newClient._id.toString(),
            details: { clientId, name: newClient.fullName, tier: newClient.tier },
        });
        res.status(201).json(new apiResponse_js_1.ApiResponse(201, newClient, "CRM client profile enrolled."));
    }
    catch (error) {
        next(error);
    }
};
exports.createCRMClient = createCRMClient;
const addClientInquiryOrTicket = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { type, subject, vehicleInterest, priority, notes } = req.body;
        const client = await CRMClient_js_1.CRMClient.findById(id);
        if (!client) {
            throw new apiResponse_js_1.ApiError(404, "CRM client not found.");
        }
        if (type === "complaint") {
            client.complaints.push({
                ticketId: `TCK-${Date.now().toString(36).toUpperCase()}`,
                subject: subject || "VIP Service Inquiry",
                priority: priority || "Medium",
                status: "Open",
                createdAt: new Date(),
            });
        }
        else {
            client.inquiries.push({
                date: new Date(),
                subject: subject || "General Vehicle Acquisition Inquiry",
                vehicleInterest,
                status: "Open",
                notes,
            });
        }
        await client.save();
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, client, "Client interaction recorded."));
    }
    catch (error) {
        next(error);
    }
};
exports.addClientInquiryOrTicket = addClientInquiryOrTicket;

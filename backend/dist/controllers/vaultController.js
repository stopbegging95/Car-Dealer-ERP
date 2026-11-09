"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVaultDocument = exports.getVaultDocuments = void 0;
const DocumentVault_js_1 = require("../models/DocumentVault.js");
const apiResponse_js_1 = require("../utils/apiResponse.js");
const AuditLog_js_1 = require("../models/AuditLog.js");
const getVaultDocuments = async (req, res, next) => {
    try {
        const { category, verificationStatus, search, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (category)
            filter.category = category;
        if (verificationStatus)
            filter.verificationStatus = verificationStatus;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { docId: { $regex: search, $options: "i" } },
                { relatedEntityId: { $regex: search, $options: "i" } },
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const documents = await DocumentVault_js_1.DocumentVault.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await DocumentVault_js_1.DocumentVault.countDocuments(filter);
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, {
            documents,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                limit: Number(limit),
            },
        }, "Compliance document vault files retrieved."));
    }
    catch (error) {
        next(error);
    }
};
exports.getVaultDocuments = getVaultDocuments;
const createVaultDocument = async (req, res, next) => {
    try {
        const { title, category, relatedEntityId, fileUrl, fileSizeMb, mimeType, expiryDate, notes, } = req.body;
        if (!title || !category || !fileUrl) {
            throw new apiResponse_js_1.ApiError(400, "Title, category, and file URL are required.");
        }
        const docId = `DOC-${Date.now().toString(36).toUpperCase()}`;
        const newDoc = await DocumentVault_js_1.DocumentVault.create({
            docId,
            title,
            category,
            relatedEntityId: relatedEntityId || "",
            fileUrl,
            fileSizeMb: Number(fileSizeMb || 1.5),
            mimeType: mimeType || "application/pdf",
            expiryDate,
            verifiedBy: req.user?.name || "Legal & Compliance Officer",
            notes: notes || "",
        });
        await AuditLog_js_1.AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.name || "System",
            userEmail: req.user?.email || "system@dealers.com",
            userRole: req.user?.role || "compliance",
            action: "VAULT_DOCUMENT_UPLOADED",
            module: "COMPLIANCE",
            resourceId: newDoc._id.toString(),
            details: { docId, category: newDoc.category, title: newDoc.title },
        });
        res.status(201).json(new apiResponse_js_1.ApiResponse(201, newDoc, "Document archived into compliance vault."));
    }
    catch (error) {
        next(error);
    }
};
exports.createVaultDocument = createVaultDocument;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCMSContent = exports.updateCMSContent = exports.createCMSContent = exports.getAllCMSContent = exports.getPublicCMSContent = void 0;
const CMSContent_js_1 = require("../models/CMSContent.js");
const apiResponse_js_1 = require("../utils/apiResponse.js");
const AuditLog_js_1 = require("../models/AuditLog.js");
// Public endpoint: Fetch published homepage CMS components
const getPublicCMSContent = async (req, res, next) => {
    try {
        const { contentType } = req.query;
        const filter = { isActive: true };
        if (contentType) {
            filter.contentType = contentType;
        }
        const items = await CMSContent_js_1.CMSContent.find(filter).sort({ orderIndex: 1, createdAt: -1 });
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, items, "Published CMS content retrieved."));
    }
    catch (error) {
        next(error);
    }
};
exports.getPublicCMSContent = getPublicCMSContent;
// Admin endpoint: Get all CMS content items
const getAllCMSContent = async (req, res, next) => {
    try {
        const { contentType, search } = req.query;
        const filter = {};
        if (contentType)
            filter.contentType = contentType;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { subtitle: { $regex: search, $options: "i" } },
            ];
        }
        const items = await CMSContent_js_1.CMSContent.find(filter).sort({ contentType: 1, orderIndex: 1, createdAt: -1 });
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, items, "All CMS content items loaded."));
    }
    catch (error) {
        next(error);
    }
};
exports.getAllCMSContent = getAllCMSContent;
// Admin endpoint: Create CMS content item
const createCMSContent = async (req, res, next) => {
    try {
        const { contentType, title, subtitle, badgeText, ctaText, ctaLink, secondaryCtaText, secondaryCtaLink, imageUrl, secondaryImageUrl, orderIndex, metadata, } = req.body;
        if (!contentType || !title || !imageUrl) {
            throw new apiResponse_js_1.ApiError(400, "Content type, title, and primary image URL are required.");
        }
        const newItem = await CMSContent_js_1.CMSContent.create({
            contentType,
            title: title.trim(),
            subtitle: subtitle || "",
            badgeText: badgeText || "",
            ctaText: ctaText || "Explore Inventory",
            ctaLink: ctaLink || "/inventory",
            secondaryCtaText: secondaryCtaText || "",
            secondaryCtaLink: secondaryCtaLink || "",
            imageUrl,
            secondaryImageUrl: secondaryImageUrl || "",
            orderIndex: orderIndex ? Number(orderIndex) : 0,
            metadata: metadata || {},
        });
        await AuditLog_js_1.AuditLog.create({
            userId: req.user?._id,
            userName: req.user?.name || "System",
            userEmail: req.user?.email || "system@dealers.com",
            userRole: req.user?.role || "admin",
            action: "CMS_CONTENT_CREATED",
            module: "CMS",
            resourceId: newItem._id.toString(),
            details: { contentType, title },
        });
        res.status(201).json(new apiResponse_js_1.ApiResponse(201, newItem, "CMS content item created successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.createCMSContent = createCMSContent;
// Admin endpoint: Update CMS content item
const updateCMSContent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await CMSContent_js_1.CMSContent.findByIdAndUpdate(id, req.body, { new: true });
        if (!item) {
            throw new apiResponse_js_1.ApiError(404, "CMS item not found.");
        }
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, item, "CMS item updated successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.updateCMSContent = updateCMSContent;
// Admin endpoint: Delete CMS content item
const deleteCMSContent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await CMSContent_js_1.CMSContent.findByIdAndDelete(id);
        if (!item) {
            throw new apiResponse_js_1.ApiError(404, "CMS item not found.");
        }
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, null, "CMS item deleted successfully."));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteCMSContent = deleteCMSContent;

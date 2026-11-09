"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = void 0;
const AuditLog_js_1 = require("../models/AuditLog.js");
const apiResponse_js_1 = require("../utils/apiResponse.js");
const getAuditLogs = async (req, res, next) => {
    try {
        const { module, action, userRole, search, page = 1, limit = 50 } = req.query;
        const filter = {};
        if (module)
            filter.module = module;
        if (action)
            filter.action = action;
        if (userRole)
            filter.userRole = userRole;
        if (search) {
            filter.$or = [
                { userName: { $regex: search, $options: "i" } },
                { userEmail: { $regex: search, $options: "i" } },
                { action: { $regex: search, $options: "i" } },
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const logs = await AuditLog_js_1.AuditLog.find(filter)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(Number(limit));
        const total = await AuditLog_js_1.AuditLog.countDocuments(filter);
        res.status(200).json(new apiResponse_js_1.ApiResponse(200, {
            logs,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                limit: Number(limit),
            },
        }, "Immutable session audit logs retrieved."));
    }
    catch (error) {
        next(error);
    }
};
exports.getAuditLogs = getAuditLogs;

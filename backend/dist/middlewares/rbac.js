"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = void 0;
const apiResponse_js_1 = require("../utils/apiResponse.js");
const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new apiResponse_js_1.ApiError(401, "User session not verified."));
        }
        // Super Admin / admin always has universal bypass
        if (req.user.role === "admin") {
            return next();
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new apiResponse_js_1.ApiError(403, `Access Denied. Your role '${req.user.role}' is not authorized for this departmental endpoint.`));
        }
        next();
    };
};
exports.restrictTo = restrictTo;

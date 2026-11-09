"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jwt_js_1 = require("../utils/jwt.js");
const apiResponse_js_1 = require("../utils/apiResponse.js");
const User_js_1 = require("../models/User.js");
const protect = async (req, res, next) => {
    try {
        let token;
        // 1. Check Authorization header: Bearer <token>
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }
        // 2. Fallback to httpOnly cookie
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        if (!token) {
            throw new apiResponse_js_1.ApiError(401, "Not authenticated. Please log in to access this resource.");
        }
        // 3. Verify token
        const decoded = (0, jwt_js_1.verifyToken)(token);
        // 4. Verify user still exists in database
        const currentUser = await User_js_1.User.findById(decoded.id).select("-password");
        if (!currentUser) {
            throw new apiResponse_js_1.ApiError(401, "The user belonging to this token no longer exists.");
        }
        if (!currentUser.isActive) {
            throw new apiResponse_js_1.ApiError(403, "Account deactivated. Please contact dealership executive administration.");
        }
        req.user = currentUser;
        next();
    }
    catch (error) {
        if (error.name === "JsonWebTokenError") {
            next(new apiResponse_js_1.ApiError(401, "Invalid session token. Please log in again."));
        }
        else if (error.name === "TokenExpiredError") {
            next(new apiResponse_js_1.ApiError(401, "Your session token has expired. Please refresh or log in again."));
        }
        else {
            next(error);
        }
    }
};
exports.protect = protect;

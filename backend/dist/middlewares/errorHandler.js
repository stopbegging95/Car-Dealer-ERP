"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const apiResponse_js_1 = require("../utils/apiResponse.js");
const env_js_1 = require("../config/env.js");
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode || 500;
    // Log to server console in development
    if (env_js_1.config.nodeEnv === "development") {
        console.error("[ERROR]:", err);
    }
    // 1. Mongoose Bad ObjectId (CastError)
    if (err.name === "CastError") {
        const message = `Resource not found with id of ${err.value}`;
        error = new apiResponse_js_1.ApiError(404, message);
    }
    // 2. Mongoose Duplicate Key (Code 11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        const message = `Duplicate value '${value}' entered for field '${field}'. Must be unique.`;
        error = new apiResponse_js_1.ApiError(400, message);
    }
    // 3. Mongoose Validation Error
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((val) => val.message);
        const message = `Invalid input data: ${errors.join(". ")}`;
        error = new apiResponse_js_1.ApiError(400, message, errors);
    }
    // 4. Send structured JSON response
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
        errors: error.errors,
        ...(env_js_1.config.nodeEnv === "development" && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;

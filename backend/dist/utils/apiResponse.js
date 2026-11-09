"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = exports.ApiResponse = void 0;
class ApiResponse {
    success;
    message;
    data;
    meta;
    statusCode;
    constructor(statusCode, data, message = "Success", meta) {
        this.statusCode = statusCode;
        this.success = statusCode >= 200 && statusCode < 300;
        this.data = data;
        this.message = message;
        if (meta !== undefined)
            this.meta = meta;
    }
}
exports.ApiResponse = ApiResponse;
class ApiError extends Error {
    statusCode;
    errors;
    constructor(statusCode, message, errors) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;

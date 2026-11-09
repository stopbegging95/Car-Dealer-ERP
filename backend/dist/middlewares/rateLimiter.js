"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimiter = exports.globalRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_js_1 = require("../config/env.js");
exports.globalRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: env_js_1.config.security.throttleTtl * 1000,
    max: env_js_1.config.security.throttleLimit,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests from this IP address. Please slow down and try again later.",
    },
});
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 attempts
    message: {
        success: false,
        message: "Too many authentication attempts. Please try again after 15 minutes.",
    },
});

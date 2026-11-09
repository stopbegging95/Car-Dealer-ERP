"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTokenCookie = exports.verifyRefreshToken = exports.verifyToken = exports.signRefreshToken = exports.signToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_js_1 = require("../config/env.js");
const signToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, env_js_1.config.jwt.secret, {
        expiresIn: env_js_1.config.jwt.expiresIn,
    });
};
exports.signToken = signToken;
const signRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, env_js_1.config.jwt.refreshSecret, {
        expiresIn: "30d",
    });
};
exports.signRefreshToken = signRefreshToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_js_1.config.jwt.secret);
};
exports.verifyToken = verifyToken;
const verifyRefreshToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_js_1.config.jwt.refreshSecret);
};
exports.verifyRefreshToken = verifyRefreshToken;
const sendTokenCookie = (res, token, refreshToken) => {
    const cookieOptions = {
        expires: new Date(Date.now() + env_js_1.config.jwt.cookieExpiresDays * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: env_js_1.config.nodeEnv === "production",
        sameSite: (env_js_1.config.nodeEnv === "production" ? "none" : "lax"),
    };
    res.cookie("token", token, cookieOptions);
    if (refreshToken) {
        res.cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
    }
};
exports.sendTokenCookie = sendTokenCookie;

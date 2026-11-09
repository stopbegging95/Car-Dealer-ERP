"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_js_1 = require("./env.js");
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(env_js_1.config.dbUrl, {
            serverSelectionTimeoutMS: 8000,
            autoIndex: true,
        });
        console.log(`[MongoDB Connected]: ${conn.connection.host} (Database: ${conn.connection.name})`);
    }
    catch (error) {
        console.error("[MongoDB Connection Error]:", error);
        // Keep app alive in dev or retry
        if (env_js_1.config.nodeEnv === "production") {
            process.exit(1);
        }
    }
};
exports.connectDB = connectDB;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const env_js_1 = require("./config/env.js");
const db_js_1 = require("./config/db.js");
const seedData_js_1 = require("./utils/seedData.js");
const PORT = env_js_1.config.port || 8080;
const server = app_js_1.default.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 CAR DEALS CMS ENTERPRISE ERP BACKEND RUNNING`);
    console.log(`🌐 Environment: ${env_js_1.config.nodeEnv}`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🔗 API Base: http://localhost:${PORT}/api`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`💳 Paystack Public Key Loaded: ${env_js_1.config.paystack.publicKey ? "YES" : "NO"}`);
    console.log(`🔒 RBAC & Security Active: Helmet, CORS, RateLimiter, MongoSanitize`);
    console.log(`=======================================================`);
});
// Connect to MongoDB Atlas in background and seed initial dataset
(0, db_js_1.connectDB)().then(async () => {
    await (0, seedData_js_1.seedDatabase)();
}).catch((err) => {
    console.error("⚠️ Initial database connection attempt failed:", err.message);
});
exports.default = server;

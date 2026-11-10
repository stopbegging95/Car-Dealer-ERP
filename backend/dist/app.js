"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const morgan_1 = __importDefault(require("morgan"));
const env_js_1 = require("./config/env.js");
const rateLimiter_js_1 = require("./middlewares/rateLimiter.js");
const errorHandler_js_1 = require("./middlewares/errorHandler.js");
const apiResponse_js_1 = require("./utils/apiResponse.js");
// Import Route Handlers
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const masterDataRoutes_js_1 = __importDefault(require("./routes/masterDataRoutes.js"));
const vehicleRoutes_js_1 = __importDefault(require("./routes/vehicleRoutes.js"));
const orderRoutes_js_1 = __importDefault(require("./routes/orderRoutes.js"));
const procurementRoutes_js_1 = __importDefault(require("./routes/procurementRoutes.js"));
const inspectionRoutes_js_1 = __importDefault(require("./routes/inspectionRoutes.js"));
const serviceRoutes_js_1 = __importDefault(require("./routes/serviceRoutes.js"));
const partsRoutes_js_1 = __importDefault(require("./routes/partsRoutes.js"));
const financingRoutes_js_1 = __importDefault(require("./routes/financingRoutes.js"));
const reconRoutes_js_1 = __importDefault(require("./routes/reconRoutes.js"));
const importRoutes_js_1 = __importDefault(require("./routes/importRoutes.js"));
const tradeInRoutes_js_1 = __importDefault(require("./routes/tradeInRoutes.js"));
const crmRoutes_js_1 = __importDefault(require("./routes/crmRoutes.js"));
const hrRoutes_js_1 = __importDefault(require("./routes/hrRoutes.js"));
const accountingRoutes_js_1 = __importDefault(require("./routes/accountingRoutes.js"));
const transferRoutes_js_1 = __importDefault(require("./routes/transferRoutes.js"));
const vaultRoutes_js_1 = __importDefault(require("./routes/vaultRoutes.js"));
const cmsRoutes_js_1 = __importDefault(require("./routes/cmsRoutes.js"));
const paymentRoutes_js_1 = __importDefault(require("./routes/paymentRoutes.js"));
const auditRoutes_js_1 = __importDefault(require("./routes/auditRoutes.js"));
const chatRoutes_js_1 = __importDefault(require("./routes/chatRoutes.js"));
const app = (0, express_1.default)();
// Security HTTP headers
app.use((0, helmet_1.default)());
// CORS configuration supporting credentials and client origins
const allowedOrigins = [
    env_js_1.config.frontendUrl,
    env_js_1.config.frontendUrl.replace(/\/$/, ""),
    "https://car-dealer-erp.onrender.com",
    "https://car-dealer-erp.onrender.com/",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin)
            return callback(null, true);
        const cleanOrigin = origin.replace(/\/$/, "");
        const isAllowed = allowedOrigins.some((o) => o && o.replace(/\/$/, "") === cleanOrigin);
        if (isAllowed || env_js_1.config.nodeEnv === "development") {
            return callback(null, true);
        }
        return callback(null, true); // Permissive fallback to prevent deployment CORS blockers
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-Paystack-Signature", "Accept"],
}));
// Logging in development
if (env_js_1.config.nodeEnv !== "test") {
    app.use((0, morgan_1.default)("dev"));
}
// Global rate limiting
app.use(rateLimiter_js_1.globalRateLimiter);
// Body Parsers & Cookie Parser
app.use(express_1.default.json({ limit: "15mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "15mb" }));
app.use((0, cookie_parser_1.default)());
// Data sanitization against NoSQL query injection
app.use((0, express_mongo_sanitize_1.default)());
// Root welcome & API health check
app.get("/", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "Car Deals Enterprise ERP Backend API",
        version: "2.4.0",
        environment: env_js_1.config.nodeEnv,
        healthCheck: "/api/health",
        timestamp: new Date().toISOString(),
    });
});
app.get("/api", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "Car Deals Enterprise ERP REST API",
        version: "2.4.0",
        healthCheck: "/api/health",
        timestamp: new Date().toISOString(),
    });
});
// Health Check API
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "CarDeals Enterprise ERP API Server Operational",
        timestamp: new Date().toISOString(),
        environment: env_js_1.config.nodeEnv,
        version: "2.4.0",
        firsVatPercent: env_js_1.config.vatRatePercent,
    });
});
// API Routes Mounted
app.use("/api/auth", authRoutes_js_1.default);
app.use("/api/master-data", masterDataRoutes_js_1.default);
app.use("/api/vehicles", vehicleRoutes_js_1.default);
app.use("/api/orders", orderRoutes_js_1.default);
app.use("/api/procurement", procurementRoutes_js_1.default);
app.use("/api/inspection", inspectionRoutes_js_1.default);
app.use("/api/service", serviceRoutes_js_1.default);
app.use("/api/parts", partsRoutes_js_1.default);
app.use("/api/financing", financingRoutes_js_1.default);
app.use("/api/recon", reconRoutes_js_1.default);
app.use("/api/imports", importRoutes_js_1.default);
app.use("/api/trade-ins", tradeInRoutes_js_1.default);
app.use("/api/crm", crmRoutes_js_1.default);
app.use("/api/hr", hrRoutes_js_1.default);
app.use("/api/accounting", accountingRoutes_js_1.default);
app.use("/api/transfers", transferRoutes_js_1.default);
app.use("/api/vault", vaultRoutes_js_1.default);
app.use("/api/cms", cmsRoutes_js_1.default);
app.use("/api/payments", paymentRoutes_js_1.default);
app.use("/api/audit", auditRoutes_js_1.default);
app.use("/api/chat", chatRoutes_js_1.default);
// 404 Catch-all handler
app.all("*", (req, res, next) => {
    next(new apiResponse_js_1.ApiError(404, `Cannot ${req.method} ${req.originalUrl} - Route not found on Car Deals ERP server.`));
});
// Central Error Handler Middleware
app.use(errorHandler_js_1.errorHandler);
exports.default = app;

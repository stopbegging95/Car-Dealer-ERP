import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";

import { config } from "./config/env.js";
import { globalRateLimiter } from "./middlewares/rateLimiter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { ApiError } from "./utils/apiResponse.js";

// Import Route Handlers
import authRoutes from "./routes/authRoutes.js";
import masterDataRoutes from "./routes/masterDataRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import procurementRoutes from "./routes/procurementRoutes.js";
import inspectionRoutes from "./routes/inspectionRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import partsRoutes from "./routes/partsRoutes.js";
import financingRoutes from "./routes/financingRoutes.js";
import reconRoutes from "./routes/reconRoutes.js";
import importRoutes from "./routes/importRoutes.js";
import tradeInRoutes from "./routes/tradeInRoutes.js";
import crmRoutes from "./routes/crmRoutes.js";
import hrRoutes from "./routes/hrRoutes.js";
import accountingRoutes from "./routes/accountingRoutes.js";
import transferRoutes from "./routes/transferRoutes.js";
import vaultRoutes from "./routes/vaultRoutes.js";
import cmsRoutes from "./routes/cmsRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";

const app: Express = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration supporting credentials and client origins
app.use(
  cors({
    origin: [
      config.frontendUrl,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-Paystack-Signature"],
  })
);

// Logging in development
if (config.nodeEnv !== "test") {
  app.use(morgan("dev"));
}

// Global rate limiting
app.use(globalRateLimiter);

// Body Parsers & Cookie Parser
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Health Check API
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "CarDeals Enterprise ERP API Server Operational",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: "2.4.0",
    firsVatPercent: config.vatRatePercent,
  });
});

// API Routes Mounted
app.use("/api/auth", authRoutes);
app.use("/api/master-data", masterDataRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/procurement", procurementRoutes);
app.use("/api/inspection", inspectionRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/parts", partsRoutes);
app.use("/api/financing", financingRoutes);
app.use("/api/recon", reconRoutes);
app.use("/api/imports", importRoutes);
app.use("/api/trade-ins", tradeInRoutes);
app.use("/api/crm", crmRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/accounting", accountingRoutes);
app.use("/api/transfers", transferRoutes);
app.use("/api/vault", vaultRoutes);
app.use("/api/cms", cmsRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/audit", auditRoutes);

// 404 Catch-all handler
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, `Cannot ${req.method} ${req.originalUrl} - Route not found on Car Deals ERP server.`));
});

// Central Error Handler Middleware
app.use(errorHandler);

export default app;


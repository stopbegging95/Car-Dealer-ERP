"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env from root project directory or local backend
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), "../.env") });
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), ".env") });
exports.config = {
    port: parseInt(process.env.PORT || "8080", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    frontendUrl: process.env.FRONTEND_URL || "https://car-dealer-erp.onrender.com",
    dbUrl: process.env.DB_URL ||
        "mongodb+srv://umariasoftwaretesting_db_user:EL0g4XoUlz37GjuA@cluster0.epphdka.mongodb.net/cardeals_erp?retryWrites=true&w=majority",
    jwt: {
        secret: process.env.JWT_SECRET_KEY || "79f84e634c4bab1497050403ee2e76381d8ca09159fdafd73011a7e2b78a5599",
        refreshSecret: process.env.JWT_REFRESH_SECRET || "d757e2c2ef3feb1c0589e092450ca661e2a4c628d2f279866e7841512da417b8",
        expiresIn: process.env.JWT_EXPIRES || "7d",
        cookieExpiresDays: parseInt(process.env.JWT_COOKIE_EXPIRES || "7", 10),
    },
    security: {
        activationSecret: process.env.ACTIVATION_SECRET || "b8177821dc2a7ec65a47a54be55cf9cc5c7c139d0e4eb11e28ce196adee04df9",
        resetPasswordSecret: process.env.RESET_PASSWORD_SECRET || "0b97decadc090618121e38d2ef971a07d95f54a50e2818bfb2ea30ffa2db594d",
        bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10),
        sessionSecret: process.env.SESSION_SECRET || "ac6abff10be0310729ff94249a36c16225f7264911c2712c756e8b2f62976c4a",
        throttleTtl: parseInt(process.env.THROTTLE_TTL || "60", 10),
        throttleLimit: parseInt(process.env.THROTTLE_LIMIT || "120", 10),
    },
    paystack: {
        baseUrl: process.env.PAYSTACK_BASE_URL || "https://api.paystack.co",
        secretKey: process.env.PAYSTACK_SECRET_KEY || "",
        publicKey: process.env.PAYSTACK_PUBLIC_KEY || "",
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_NAME || "",
        apiKey: process.env.CLOUDINARY_API_KEY || "",
        apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    },
    mailgun: {
        apiKey: process.env.MAILGUN_API_KEY || "",
        domain: process.env.MAILGUN_DOMAIN || "",
        fromEmail: process.env.MAILGUN_FROM_EMAIL || "info@wumbisconcept.com",
        fromName: process.env.MAILGUN_FROM_NAME || "Car Deals ERP",
    },
    redisUrl: process.env.REDIS_URL || "redis://127.0.0.1:6379",
    vatRatePercent: parseFloat(process.env.FIRS_VAT_RATE_PERCENT || "7.5"),
};

import rateLimit from "express-rate-limit";
import { config } from "../config/env.js";

export const globalRateLimiter = rateLimit({
  windowMs: config.security.throttleTtl * 1000,
  max: config.security.throttleLimit,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP address. Please slow down and try again later.",
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again after 15 minutes.",
  },
});


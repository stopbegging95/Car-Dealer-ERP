import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiResponse.js";
import { config } from "../config/env.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log to server console in development
  if (config.nodeEnv === "development") {
    console.error("[ERROR]:", err);
  }

  // 1. Mongoose Bad ObjectId (CastError)
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ApiError(404, message);
  }

  // 2. Mongoose Duplicate Key (Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate value '${value}' entered for field '${field}'. Must be unique.`;
    error = new ApiError(400, message);
  }

  // 3. Mongoose Validation Error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((val: any) => val.message);
    const message = `Invalid input data: ${errors.join(". ")}`;
    error = new ApiError(400, message, errors);
  }

  // 4. Send structured JSON response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
    errors: error.errors,
    ...(config.nodeEnv === "development" && { stack: err.stack }),
  });
};


import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiResponse.js";

export const restrictTo = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, "User session not verified."));
    }

    // Super Admin / admin always has universal bypass
    if (req.user.role === "admin") {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access Denied. Your role '${req.user.role}' is not authorized for this departmental endpoint.`
        )
      );
    }

    next();
  };
};


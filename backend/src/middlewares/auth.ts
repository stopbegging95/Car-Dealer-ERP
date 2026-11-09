import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt.js";
import { ApiError } from "../utils/apiResponse.js";
import { User } from "../models/User.js";

// Extend Express Request interface to carry user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // 1. Check Authorization header: Bearer <token>
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    // 2. Fallback to httpOnly cookie
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new ApiError(401, "Not authenticated. Please log in to access this resource.");
    }

    // 3. Verify token
    const decoded: JwtPayload = verifyToken(token);

    // 4. Verify user still exists in database
    const currentUser = await User.findById(decoded.id).select("-password");
    if (!currentUser) {
      throw new ApiError(401, "The user belonging to this token no longer exists.");
    }

    if (!currentUser.isActive) {
      throw new ApiError(403, "Account deactivated. Please contact dealership executive administration.");
    }

    req.user = currentUser;
    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      next(new ApiError(401, "Invalid session token. Please log in again."));
    } else if (error.name === "TokenExpiredError") {
      next(new ApiError(401, "Your session token has expired. Please refresh or log in again."));
    } else {
      next(error);
    }
  }
};


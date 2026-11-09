import { Request, Response, NextFunction } from "express";
import { AuditLog } from "../models/AuditLog.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { module, action, userRole, search, page = 1, limit = 50 } = req.query;
    const filter: Record<string, any> = {};

    if (module) filter.module = module;
    if (action) filter.action = action;
    if (userRole) filter.userRole = userRole;
    if (search) {
      filter.$or = [
        { userName: { $regex: search as string, $options: "i" } },
        { userEmail: { $regex: search as string, $options: "i" } },
        { action: { $regex: search as string, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const logs = await AuditLog.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await AuditLog.countDocuments(filter);

    res.status(200).json(
      new ApiResponse(200, {
        logs,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
      }, "Immutable session audit logs retrieved.")
    );
  } catch (error) {
    next(error);
  }
};


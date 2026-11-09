import { Request, Response, NextFunction } from "express";
import { User } from "../models/User.js";
import { signToken, sendTokenCookie } from "../utils/jwt.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";
import { AuditLog } from "../models/AuditLog.js";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, role, department, branch, phone } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "Please provide name, email, and password.");
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(409, "An account with this email already exists.");
    }

    // Default self-registered accounts to "customer" unless created by an authenticated admin
    let assignedRole = "customer";
    if (req.user && req.user.role === "admin" && role) {
      assignedRole = role;
    }

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: assignedRole,
      department: department || "General Operations",
      branch: branch || "Victoria Island HQ, Lagos",
      phone: phone || "",
    });

    // Record in Audit Trail
    await AuditLog.create({
      userId: newUser._id,
      userName: newUser.name,
      userEmail: newUser.email,
      userRole: newUser.role,
      action: "USER_REGISTERED",
      module: "AUTH",
      details: { role: assignedRole, department: newUser.department },
    });

    const token = signToken({
      id: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    sendTokenCookie(res, token);

    res.status(201).json(
      new ApiResponse(201, {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          department: newUser.department,
          branch: newUser.branch,
          avatar: newUser.avatar,
        },
        token,
      }, "Registration successful.")
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Please provide email and password.");
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      throw new ApiError(401, "Invalid email or credentials.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid email or credentials.");
    }

    if (!user.isActive) {
      throw new ApiError(403, "Account deactivated. Contact dealership administration.");
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Record login audit
    await AuditLog.create({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      action: "USER_LOGIN_SUCCESS",
      module: "AUTH",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.get("User-Agent") || "Browser Client",
    });

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });

    sendTokenCookie(res, token);

    res.status(200).json(
      new ApiResponse(200, {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          branch: user.branch,
          avatar: user.avatar,
          phone: user.phone,
        },
        token,
      }, "Login successful.")
    );
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Not authenticated.");
    }
    res.status(200).json(new ApiResponse(200, req.user, "Current user profile fetched successfully."));
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    if (req.user) {
      await AuditLog.create({
        userId: req.user._id,
        userName: req.user.name,
        userEmail: req.user.email,
        userRole: req.user.role,
        action: "USER_LOGOUT",
        module: "AUTH",
      });
    }

    res.status(200).json(new ApiResponse(200, null, "Logged out successfully."));
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { role, department, search, page = 1, limit = 50 } = req.query;
    const filter: Record<string, any> = {};

    if (role) filter.role = role;
    if (department) filter.department = department;
    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: "i" } },
        { email: { $regex: search as string, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json(
      new ApiResponse(200, {
        users,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
      }, "Staff and user accounts fetched successfully.")
    );
  } catch (error) {
    next(error);
  }
};


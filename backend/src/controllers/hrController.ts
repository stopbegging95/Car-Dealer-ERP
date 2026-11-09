import { Request, Response, NextFunction } from "express";
import { HREmployee } from "../models/HREmployee.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";
import { AuditLog } from "../models/AuditLog.js";

export const getEmployees = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { department, status, search, page = 1, limit = 20 } = req.query;
    const filter: Record<string, any> = {};

    if (department) filter.department = department;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search as string, $options: "i" } },
        { employeeId: { $regex: search as string, $options: "i" } },
        { roleTitle: { $regex: search as string, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const employees = await HREmployee.find(filter)
      .sort({ department: 1, fullName: 1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await HREmployee.countDocuments(filter);

    res.status(200).json(
      new ApiResponse(200, {
        employees,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
      }, "HR staff roster retrieved.")
    );
  } catch (error) {
    next(error);
  }
};

export const createEmployee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      fullName,
      department,
      roleTitle,
      employmentType,
      salaryMonthlyNGN,
      allowancesNGN,
      bankDetails,
    } = req.body;

    if (!fullName || !department || !roleTitle || !salaryMonthlyNGN) {
      throw new ApiError(400, "Full name, department, role, and monthly salary are required.");
    }

    const employeeId = `EMP-${Date.now().toString(36).toUpperCase()}`;

    const newEmp = await HREmployee.create({
      employeeId,
      fullName,
      department,
      roleTitle,
      employmentType: employmentType || "Full-Time Executive",
      salaryMonthlyNGN: Number(salaryMonthlyNGN),
      allowancesNGN: Number(allowancesNGN || 0),
      bankDetails: bankDetails || {
        bankName: "Zenith Bank PLC",
        accountNumber: "0000000000",
        accountName: fullName,
      },
    });

    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.name || "System",
      userEmail: req.user?.email || "system@dealers.com",
      userRole: req.user?.role || "hr",
      action: "HR_EMPLOYEE_ONBOARDED",
      module: "HR",
      resourceId: newEmp._id.toString(),
      details: { employeeId, name: newEmp.fullName, department: newEmp.department },
    });

    res.status(201).json(new ApiResponse(201, newEmp, "Employee onboarded into staff ledger."));
  } catch (error) {
    next(error);
  }
};

export const clockInAttendance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status = "Present" } = req.body;

    const emp = await HREmployee.findById(id);
    if (!emp) {
      throw new ApiError(404, "Employee record not found.");
    }

    const todayDate = new Date().toISOString().split("T")[0];
    const nowTime = new Date().toLocaleTimeString();

    emp.attendanceLogs.push({
      date: todayDate,
      checkInTime: nowTime,
      status,
    });

    await emp.save();
    res.status(200).json(new ApiResponse(200, emp, `Clock-in recorded at ${nowTime}.`));
  } catch (error) {
    next(error);
  }
};


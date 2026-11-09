import { Request, Response, NextFunction } from "express";
import { CRMClient } from "../models/CRMClient.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";
import { AuditLog } from "../models/AuditLog.js";

export const getCRMClients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tier, search, page = 1, limit = 20 } = req.query;
    const filter: Record<string, any> = {};

    if (tier) filter.tier = tier;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search as string, $options: "i" } },
        { email: { $regex: search as string, $options: "i" } },
        { phone: { $regex: search as string, $options: "i" } },
        { companyName: { $regex: search as string, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const clients = await CRMClient.find(filter)
      .sort({ lifetimeSpendNGN: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await CRMClient.countDocuments(filter);

    res.status(200).json(
      new ApiResponse(200, {
        clients,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
      }, "CRM VIP private clients retrieved.")
    );
  } catch (error) {
    next(error);
  }
};

export const createCRMClient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { fullName, email, phone, companyName, tier, preferredBrands, relationshipManagerName } = req.body;

    if (!fullName || !email || !phone) {
      throw new ApiError(400, "Full name, email, and phone are required.");
    }

    const clientId = `VIP-${Date.now().toString(36).toUpperCase()}`;

    const newClient = await CRMClient.create({
      clientId,
      fullName,
      email: email.toLowerCase(),
      phone,
      companyName: companyName || "",
      tier: tier || "Standard",
      preferredBrands: preferredBrands || ["Mercedes-Benz", "Land Rover"],
      relationshipManagerName: relationshipManagerName || req.user?.name || "VIP Private Client Executive",
    });

    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.name || "System",
      userEmail: req.user?.email || "system@dealers.com",
      userRole: req.user?.role || "crm",
      action: "CRM_CLIENT_CREATED",
      module: "CRM",
      resourceId: newClient._id.toString(),
      details: { clientId, name: newClient.fullName, tier: newClient.tier },
    });

    res.status(201).json(new ApiResponse(201, newClient, "CRM client profile enrolled."));
  } catch (error) {
    next(error);
  }
};

export const addClientInquiryOrTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { type, subject, vehicleInterest, priority, notes } = req.body;

    const client = await CRMClient.findById(id);
    if (!client) {
      throw new ApiError(404, "CRM client not found.");
    }

    if (type === "complaint") {
      client.complaints.push({
        ticketId: `TCK-${Date.now().toString(36).toUpperCase()}`,
        subject: subject || "VIP Service Inquiry",
        priority: priority || "Medium",
        status: "Open",
        createdAt: new Date(),
      });
    } else {
      client.inquiries.push({
        date: new Date(),
        subject: subject || "General Vehicle Acquisition Inquiry",
        vehicleInterest,
        status: "Open",
        notes,
      });
    }

    await client.save();
    res.status(200).json(new ApiResponse(200, client, "Client interaction recorded."));
  } catch (error) {
    next(error);
  }
};


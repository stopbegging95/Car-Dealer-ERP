import { Request, Response, NextFunction } from "express";
import { DocumentVault } from "../models/DocumentVault.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";
import { AuditLog } from "../models/AuditLog.js";

export const getVaultDocuments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, verificationStatus, search, page = 1, limit = 20 } = req.query;
    const filter: Record<string, any> = {};

    if (category) filter.category = category;
    if (verificationStatus) filter.verificationStatus = verificationStatus;
    if (search) {
      filter.$or = [
        { title: { $regex: search as string, $options: "i" } },
        { docId: { $regex: search as string, $options: "i" } },
        { relatedEntityId: { $regex: search as string, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const documents = await DocumentVault.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await DocumentVault.countDocuments(filter);

    res.status(200).json(
      new ApiResponse(200, {
        documents,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          limit: Number(limit),
        },
      }, "Compliance document vault files retrieved.")
    );
  } catch (error) {
    next(error);
  }
};

export const createVaultDocument = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      title,
      category,
      relatedEntityId,
      fileUrl,
      fileSizeMb,
      mimeType,
      expiryDate,
      notes,
    } = req.body;

    if (!title || !category || !fileUrl) {
      throw new ApiError(400, "Title, category, and file URL are required.");
    }

    const docId = `DOC-${Date.now().toString(36).toUpperCase()}`;

    const newDoc = await DocumentVault.create({
      docId,
      title,
      category,
      relatedEntityId: relatedEntityId || "",
      fileUrl,
      fileSizeMb: Number(fileSizeMb || 1.5),
      mimeType: mimeType || "application/pdf",
      expiryDate,
      verifiedBy: req.user?.name || "Legal & Compliance Officer",
      notes: notes || "",
    });

    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.name || "System",
      userEmail: req.user?.email || "system@dealers.com",
      userRole: req.user?.role || "compliance",
      action: "VAULT_DOCUMENT_UPLOADED",
      module: "COMPLIANCE",
      resourceId: newDoc._id.toString(),
      details: { docId, category: newDoc.category, title: newDoc.title },
    });

    res.status(201).json(new ApiResponse(201, newDoc, "Document archived into compliance vault."));
  } catch (error) {
    next(error);
  }
};


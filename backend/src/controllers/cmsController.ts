import { Request, Response, NextFunction } from "express";
import { CMSContent } from "../models/CMSContent.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";
import { AuditLog } from "../models/AuditLog.js";

// Public endpoint: Fetch published homepage CMS components
export const getPublicCMSContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { contentType } = req.query;
    const filter: Record<string, any> = { isActive: true };

    if (contentType) {
      filter.contentType = contentType;
    }

    const items = await CMSContent.find(filter).sort({ orderIndex: 1, createdAt: -1 });

    res.status(200).json(new ApiResponse(200, items, "Published CMS content retrieved."));
  } catch (error) {
    next(error);
  }
};

// Admin endpoint: Get all CMS content items
export const getAllCMSContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { contentType, search } = req.query;
    const filter: Record<string, any> = {};

    if (contentType) filter.contentType = contentType;
    if (search) {
      filter.$or = [
        { title: { $regex: search as string, $options: "i" } },
        { subtitle: { $regex: search as string, $options: "i" } },
      ];
    }

    const items = await CMSContent.find(filter).sort({ contentType: 1, orderIndex: 1, createdAt: -1 });
    res.status(200).json(new ApiResponse(200, items, "All CMS content items loaded."));
  } catch (error) {
    next(error);
  }
};

// Admin endpoint: Create CMS content item
export const createCMSContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      contentType,
      title,
      subtitle,
      badgeText,
      ctaText,
      ctaLink,
      secondaryCtaText,
      secondaryCtaLink,
      imageUrl,
      secondaryImageUrl,
      orderIndex,
      metadata,
    } = req.body;

    if (!contentType || !title || !imageUrl) {
      throw new ApiError(400, "Content type, title, and primary image URL are required.");
    }

    const newItem = await CMSContent.create({
      contentType,
      title: title.trim(),
      subtitle: subtitle || "",
      badgeText: badgeText || "",
      ctaText: ctaText || "Explore Inventory",
      ctaLink: ctaLink || "/inventory",
      secondaryCtaText: secondaryCtaText || "",
      secondaryCtaLink: secondaryCtaLink || "",
      imageUrl,
      secondaryImageUrl: secondaryImageUrl || "",
      orderIndex: orderIndex ? Number(orderIndex) : 0,
      metadata: metadata || {},
    });

    await AuditLog.create({
      userId: req.user?._id,
      userName: req.user?.name || "System",
      userEmail: req.user?.email || "system@dealers.com",
      userRole: req.user?.role || "admin",
      action: "CMS_CONTENT_CREATED",
      module: "CMS",
      resourceId: newItem._id.toString(),
      details: { contentType, title },
    });

    res.status(201).json(new ApiResponse(201, newItem, "CMS content item created successfully."));
  } catch (error) {
    next(error);
  }
};

// Admin endpoint: Update CMS content item
export const updateCMSContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await CMSContent.findByIdAndUpdate(id, req.body, { new: true });

    if (!item) {
      throw new ApiError(404, "CMS item not found.");
    }

    res.status(200).json(new ApiResponse(200, item, "CMS item updated successfully."));
  } catch (error) {
    next(error);
  }
};

// Admin endpoint: Delete CMS content item
export const deleteCMSContent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const item = await CMSContent.findByIdAndDelete(id);

    if (!item) {
      throw new ApiError(404, "CMS item not found.");
    }

    res.status(200).json(new ApiResponse(200, null, "CMS item deleted successfully."));
  } catch (error) {
    next(error);
  }
};


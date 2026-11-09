import { Request, Response, NextFunction } from "express";
import { ChatMessage } from "../models/ChatMessage.js";
import { ApiResponse, ApiError } from "../utils/apiResponse.js";

// Fetch chat messages by target (channel or direct contact)
export const getChatMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { targetId, targetType } = req.query;
    const filter: Record<string, any> = {};

    if (targetId) filter.targetId = targetId;
    if (targetType) filter.targetType = targetType;

    const messages = await ChatMessage.find(filter).sort({ createdAt: 1 }).limit(100);

    res.status(200).json(new ApiResponse(200, messages, "Chat messages retrieved."));
  } catch (error) {
    next(error);
  }
};

// Post a new staff chat message
export const postChatMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { senderName, senderRole, senderDepartment, senderInitials, senderEmail, targetId, targetType, content, timestamp } = req.body;

    if (!content || !targetId) {
      throw new ApiError(400, "Message content and targetId are required.");
    }

    const message = await ChatMessage.create({
      senderName: senderName || "Dealership Staff",
      senderRole: senderRole || "Staff",
      senderDepartment: senderDepartment || "Dealership HQ",
      senderInitials: senderInitials || "ST",
      senderEmail: senderEmail || "staff@luxauto.dealers.com",
      targetId,
      targetType: targetType || "channel",
      content,
      timestamp: timestamp || new Date().toISOString(),
    });

    res.status(201).json(new ApiResponse(201, message, "Staff message transmitted."));
  } catch (error) {
    next(error);
  }
};


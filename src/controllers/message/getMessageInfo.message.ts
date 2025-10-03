import { NextFunction, Request, Response } from "express";
import AuthRequest from "../../types/AuthRequest.types.js";
import { AppError } from "../../utils/AppError.js";
import messageModel from "../../DB/Models/message.model.js";
import { isValidObjectId } from "mongoose";

export const getMessageInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { messageId } = req.params;
    if (!messageId) return next(new AppError("Message ID is required", 400));
    if (!isValidObjectId(messageId))
      return next(new AppError("Invalid message ID", 400));

    const message = await messageModel.findById(messageId);
    if (!message) return next(new AppError("Message not found", 404));

    res.status(200).json({
      success: true,
      message: "Message fetched successfully",
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { isValidObjectId } from "mongoose";
import AuthRequest from "../../types/AuthRequest.types.js";
import messageModel from "../../DB/Models/message.model.js";
import redis from "../../helpers/redis.js";

export const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { messageId } = req.params;
    if (!messageId) return next(new AppError("Message ID is required", 400));
    if (!isValidObjectId(messageId))
      return next(new AppError("Invalid message ID", 400));

    const authUser = (req as AuthRequest).authUser;
    if (authUser.role !== "admin")
      return next(new AppError("Forbidden access", 403));

    const message = await messageModel.findById(messageId);
    if (!message) return next(new AppError("Message not found", 404));

    await messageModel.findByIdAndDelete(messageId);

    await redis.del("messages:all");
    await redis.del("message");

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

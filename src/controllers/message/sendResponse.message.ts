import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { isValidObjectId } from "mongoose";
import messageModel from "../../DB/Models/message.model.js";
import AuthRequest from "../../types/AuthRequest.types.js";
import sendEmailService from "../../utils/email.js";
import redis from "../../helpers/redis.js";

export const sendMessaeResponse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { messageId } = req.params;
    if (!messageId) return next(new AppError("Message ID is required", 400));
    if (!isValidObjectId(messageId))
      return next(new AppError("Invalid message ID", 400));

    const { response } = req.body;
    if (!response) {
      return next(new AppError("Response is required", 400));
    }

    const message = await messageModel.findById(messageId);
    if (!message) return next(new AppError("Message not found", 404));
    if (message.status === "read")
      return next(new AppError("Message already read and response sent", 400));

    message.status = "read";
    message.response = response;
    await message.save();

    await redis.del("messages:all");
    await redis.del("message");
    res.status(200).json({
      success: true,
      message: "Message response sent successfully",
    });
    await sendEmailService({
      to: message.email,
      subject: `Thank you for contacting us`,
      message: `
        <h1>Hello ${message.name},</h1>
        <p>Thank you for contacting us. We have received your message and will get back to you shortly.</p>
        <p>Your message: ${message.message}</p>
        <p>Our response: ${response}</p>
        `,
    });
  } catch (error) {}
};

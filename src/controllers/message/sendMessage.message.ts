import { NextFunction, Request, Response } from "express";
import messageModel from "../../DB/Models/message.model.js";
import { AppError } from "../../utils/AppError.js";
import sendEmailService from "../../utils/email.js";
import redis from "../../helpers/redis.js";

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, subject, message } = req.body;
    const isSender = await messageModel.findOne({ status: "unread", email });
    if (isSender)
      return next(
        new AppError(
          "you already sent a message before , please wait for a response from our team",
          409
        )
      );

    await messageModel.create({
      name,
      email,
      subject,
      message,
      status: "unread",
    });
    await redis.del("messages:all");
    res.status(200).json({
      success: true,
      message: "Message sent successfully , we will get back to you shortly",
      data: { name, email, subject, message },
    });
    await sendEmailService({
      to: email,
      subject: `Thank you for contacting us`,
      message: `
        <h1>Hello ${name},</h1>
        <p>Thank you for contacting us. We have received your message and will get back to you shortly.</p>
        <p>Your message: ${message}</p>
        `,
    });
  } catch (error) {}
};

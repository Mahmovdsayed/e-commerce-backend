import { NextFunction, Request, Response } from "express";
import AuthRequest from "../../types/AuthRequest.types.js";
import { AppError } from "../../utils/AppError.js";
import messageModel from "../../DB/Models/message.model.js";

export const getAllMessagesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authUser = (req as AuthRequest).authUser;
    if (authUser.role !== "admin")
      return next(new AppError("Forbidden access", 403));

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const total_results = await messageModel.countDocuments();
    const total_pages = Math.ceil(total_results / limit);

    const skip = (page - 1) * limit;
    const messages = await messageModel
      .find()
      .select("name subject status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      page,
      limit,
      total_pages,
      total_results,
      results: messages,
    });
  } catch (error) {
    next(error);
  }
};

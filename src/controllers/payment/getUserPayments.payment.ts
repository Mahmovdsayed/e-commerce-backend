import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { AppError } from "../../utils/AppError.js";
import paymentModel from "../../DB/Models/payment.model.js";

export const getUserPayments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId))return next(new AppError("Invalid user ID", 400));

    const payments = await paymentModel.find({ userId }).populate("orderId");
    if (!payments || payments.length === 0) return next(new AppError("No payments found for this user", 404));
      
    res.status(200).json({ success: true, count: payments.length, payments });
  } catch (err) {
    next(err);
  }
};

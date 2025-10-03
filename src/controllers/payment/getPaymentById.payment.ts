import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { AppError } from "../../utils/AppError.js";
import paymentModel from "../../DB/Models/payment.model.js";

export const getPaymentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { paymentId } = req.params;
    if (!isValidObjectId(paymentId))
      return next(new AppError("Invalid payment ID", 400));

    const payment = await paymentModel
      .findById(paymentId)
      .populate("orderId userId");
    if (!payment) return next(new AppError("Payment not found", 404));

    res.status(200).json({ success: true, payment });
  } catch (err) {
    next(err);
  }
};

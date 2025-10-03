import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { AppError } from "../../utils/AppError.js";
import paymentModel from "../../DB/Models/payment.model.js";
import { stripe } from "../../Integrations/stripe.js";

export const refundPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { paymentId } = req.params;
    if (!isValidObjectId(paymentId))
      return next(new AppError("Invalid payment ID", 400));

    const payment = await paymentModel.findById(paymentId);
    if (!payment) return next(new AppError("Payment not found", 404));

    if (payment.status !== "success")
      return next(
        new AppError("Only successful payments can be refunded", 400)
      );

    const refund = await stripe.refunds.create({
      payment_intent: payment.transactionId,
    });

    payment.status = "failed";
    await payment.save();

    res.status(200).json({
      success: true,
      message: "Payment refunded successfully",
      refund,
      payment,
    });
  } catch (err) {
    next(err);
  }
};

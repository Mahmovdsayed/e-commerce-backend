import { NextFunction, Request, Response } from "express";
import AuthRequest from "../../types/AuthRequest.types.js";
import cartModel from "../../DB/Models/cart.model.js";
import discountModel from "../../DB/Models/discount.model.js";
import { AppError } from "../../utils/AppError.js";
import redis from "../../helpers/redis.js";

export const applyDiscountHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code } = req.body;
    const userId = (req as AuthRequest).authUser?._id;

    if (!userId) return next(new AppError("User not found", 404));

    const cart = await cartModel.findOne({ userId });
    if (!cart) return next(new AppError("Cart not found", 404));

    const discount = await discountModel.findOne({ code: code.toUpperCase(), isActive: true });
    if (!discount) return next(new AppError("Invalid or expired discount code", 400));

    if (discount.expiresAt < new Date()) {
      return next(new AppError("Discount code expired", 400));
    }

    if (cart.totalPrice < discount.minCartValue) {
      return next(new AppError(`Cart must be at least ${discount.minCartValue} to apply this code`, 400));
    }

    let discountAmount = 0;
    if (discount.discountType === "percentage") {
      discountAmount = (cart.totalPrice * discount.discountValue) / 100;
    } else {
      discountAmount = discount.discountValue;
    }

    cart.discount = discountAmount;
    cart.totalPriceAfterDiscount = Math.max(cart.totalPrice - discountAmount, 0);
    cart.appliedDiscountCode = discount.code;
    cart.totalPrice = cart.totalPriceAfterDiscount;


    await cart.save();
    await redis.del(`cart`);

    res.status(200).json({
      success: true,
      message: "Discount applied successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

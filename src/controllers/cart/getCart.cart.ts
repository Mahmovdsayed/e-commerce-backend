import { NextFunction, Request, Response } from "express";
import AuthRequest from "../../types/AuthRequest.types.js";
import { AppError } from "../../utils/AppError.js";
import { isValidObjectId } from "mongoose";
import cartModel from "../../DB/Models/cart.model.js";

export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as AuthRequest).authUser._id;
    if (!userId) return next(new AppError("User not found", 404));
    if (!isValidObjectId(userId))
      return next(new AppError("Invalid user id", 400));

    const cart = await cartModel
      .findOne({ userId })
      .populate("items.productId");

    if (!cart) return next(new AppError("Cart not found", 404));

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

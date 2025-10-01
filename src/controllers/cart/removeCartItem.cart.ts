import { NextFunction, Request, Response } from "express";
import AuthRequest from "../../types/AuthRequest.types.js";
import { isValidObjectId } from "mongoose";
import { AppError } from "../../utils/AppError.js";
import cartModel from "../../DB/Models/cart.model.js";
import redis from "../../helpers/redis.js";

export const removeCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const userId = (req as AuthRequest).authUser._id;
    if (!userId) return next(new AppError("User not found", 404));
    if (!isValidObjectId(userId))
      return next(new AppError("Invalid user id", 400));

    const cart = await cartModel.findOne({ userId });
    if (!cart) return next(new AppError("Cart not found", 404));

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    await cart.save();
    await redis.del(`cart`);

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

import { NextFunction, Request, Response } from "express";
import AuthRequest from "../../types/AuthRequest.types.js";
import { isValidObjectId } from "mongoose";
import { AppError } from "../../utils/AppError.js";
import cartModel from "../../DB/Models/cart.model.js";
import redis from "../../helpers/redis.js";

export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, quantity } = req.body;
    const authUser = (req as AuthRequest).authUser;

    if (!isValidObjectId(productId))
      return next(new AppError("Invalid product id", 400));
    if (!quantity) return next(new AppError("Quantity is required", 400));
    if (quantity <= 0)
      return next(new AppError("Quantity must be greater than 0", 400));
    if (quantity > 10)
      return next(
        new AppError("Quantity must be less than or equal to 10", 400)
      );

    const cart = await cartModel.findOne({ userId: authUser._id });
    if (!cart) return next(new AppError("Cart not found", 404));

    const itemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === productId
    );

    if (itemIndex === -1) return next(new AppError("Product not in cart", 404));
    cart.items[itemIndex].quantity = quantity;

    await cart.save();
    await redis.del(`cart`);

    res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

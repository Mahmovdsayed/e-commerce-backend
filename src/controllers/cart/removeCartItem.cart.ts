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
): Promise<void> => {
  try {
    const { productId } = req.params;
    const userId = (req as AuthRequest).authUser?._id;

    if (!userId) return next(new AppError("User not found", 404));

    if (!isValidObjectId(userId))
      return next(new AppError("Invalid user id", 400));

    if (!isValidObjectId(productId))
      return next(new AppError("Invalid product id", 400));

    const cart = await cartModel.findOne({ userId });
    if (!cart) return next(new AppError("Cart not found", 404));

    const prevLength = cart.cartItems.length;
    cart.cartItems = cart.cartItems.filter(
      (i) => i.productId.toString() !== productId
    );

    if (cart.cartItems.length === prevLength)
      return next(new AppError("Item not found in cart", 404));
    cart.totalPrice = cart.cartItems.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
    cart.totalPriceAfterDiscount = cart.totalPrice;
    cart.discount = 0;

    if (cart.cartItems.length === 0) {
      await cartModel.findOneAndDelete({ userId });
      await redis.del(`cart`);
      res.status(200).json({
        success: true,
        message: "Item removed from cart successfully, cart is now empty",
        data: null,
      });
    }

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

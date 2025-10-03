import { NextFunction, Request, Response } from "express";
import AuthRequest from "../../types/AuthRequest.types.js";
import { isValidObjectId } from "mongoose";
import { AppError } from "../../utils/AppError.js";
import cartModel from "../../DB/Models/cart.model.js";
import redis from "../../helpers/redis.js";
import productModel from "../../DB/Models/product.model.js";

export const updateCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, quantity } = req.body;
    const userId = (req as AuthRequest).authUser?._id;

    if (!userId) return next(new AppError("User not found", 404));
    if (!isValidObjectId(userId))
      return next(new AppError("Invalid user id", 400));
    if (!isValidObjectId(productId))
      return next(new AppError("Invalid product id", 400));
    if (quantity === undefined || quantity < 0)
      return next(new AppError("Invalid quantity", 400));

    const cart = await cartModel.findOne({ userId });
    if (!cart) return next(new AppError("Cart not found", 404));

    const itemIndex = cart.cartItems.findIndex(
      (i) => i.productId.toString() === productId
    );

    if (itemIndex === -1)
      return next(new AppError("Item not found in cart", 404));

    if (quantity === 0) {
      cart.cartItems.splice(itemIndex, 1);
    } else {
      const product = await productModel.findById(productId);
      if (!product) return next(new AppError("Product not found", 404));

      cart.cartItems[itemIndex].quantity = quantity;
      cart.cartItems[itemIndex].price = product.price;
    }

    cart.totalPrice = cart.cartItems.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
    cart.totalPriceAfterDiscount = cart.totalPrice;
    cart.discount = 0;

    if (cart.cartItems.length === 0) {
      await cartModel.findOneAndDelete({ userId });
      await redis.del(`cart:${userId}`);
      res.status(200).json({
        success: true,
        message: "Cart is now empty",
        data: null,
      });
    }

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

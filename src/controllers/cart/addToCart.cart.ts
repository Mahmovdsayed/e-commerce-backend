import { NextFunction, Request, Response } from "express";
import AuthRequest from "../../types/AuthRequest.types.js";
import { isValidObjectId } from "mongoose";
import { AppError } from "../../utils/AppError.js";
import cartModel from "../../DB/Models/cart.model.js";
import productModel from "../../DB/Models/product.model.js";
import redis from "../../helpers/redis.js";

export const addToCartHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, quantity } = req.body;
    const userId = (req as AuthRequest).authUser?._id;

    if (!userId) return next(new AppError("User not found", 404));
    if (!isValidObjectId(userId))
      return next(new AppError("Invalid user id", 400));
    if (!isValidObjectId(productId))
      return next(new AppError("Invalid product id", 400));
    if (!quantity || quantity < 1)
      return next(new AppError("Invalid quantity", 400));

    const product = await productModel.findById(productId);
    if (!product) return next(new AppError("Product not found", 404));

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      cart = new cartModel({
        userId,
        cartItems: [{ productId, quantity, price: product.price }],
        totalPrice: product.price * quantity,
        totalPriceAfterDiscount: product.price * quantity,
        discount: 0,
      });
    } else {
      const itemIndex = cart.cartItems.findIndex(
        (i) => i.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.cartItems[itemIndex].quantity += quantity;
        cart.cartItems[itemIndex].price = product.price;
      } else {
        cart.cartItems.push({ productId, quantity, price: product.price });
      }

      cart.totalPrice = cart.cartItems.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
      );
      cart.totalPriceAfterDiscount = cart.totalPrice;
      cart.discount = 0;
    }

    await cart.save();
    await redis.del(`cart`);

    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

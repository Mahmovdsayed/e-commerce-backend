import { NextFunction, Request, Response } from "express";
import AuthRequest from "../../types/AuthRequest.types.js";
import { AppError } from "../../utils/AppError.js";
import { isValidObjectId } from "mongoose";
import productModel from "../../DB/Models/product.model.js";
import cartModel from "../../DB/Models/cart.model.js";
import redis from "../../helpers/redis.js";

export const addToCartHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, quantity } = req.body;
    const authUser = (req as AuthRequest).authUser;

    if (!productId) return next(new AppError("Product id is required", 400));
    if (!isValidObjectId(productId))
      return next(new AppError("Invalid product id", 400));
    if (!quantity) return next(new AppError("Quantity is required", 400));
    if (quantity <= 0)
      return next(new AppError("Quantity must be greater than 0", 400));
    if (quantity > 10)
      return next(
        new AppError("Quantity must be less than or equal to 10", 400)
      );

    const product = await productModel.findById(productId);
    if (!product) return next(new AppError("Product not found", 404));
    if (!product.isActive)
      return next(new AppError("Product is not active", 400));
    if (product.stock < quantity)
      return next(new AppError("Not enough stock available", 400));

    let cart = await cartModel.findOne({ userId: authUser._id });
    if (!cart) {
      cart = new cartModel({
        userId: authUser._id,
        items: [{ productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        const newQuantity = cart.items[itemIndex].quantity + quantity;
        if (newQuantity > 10) {
          return next(
            new AppError("Quantity per product cannot exceed 10", 400)
          );
        }
        if (newQuantity > product.stock) {
          return next(new AppError("Not enough stock available", 400));
        }
        cart.items[itemIndex].quantity = newQuantity;
      } else {
        cart.items.push({ productId, quantity });
      }
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

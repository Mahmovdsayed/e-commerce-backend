import { NextFunction, Request, Response } from "express";
import AuthRequest from "../../types/AuthRequest.types.js";
import cartModel from "../../DB/Models/cart.model.js";
import redis from "../../helpers/redis.js";

export const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthRequest).authUser._id;
    await cartModel.findOneAndDelete({ userId });
    await redis.del(`cart`);
    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    next(error);
  }
};

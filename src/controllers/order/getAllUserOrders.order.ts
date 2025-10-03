import { NextFunction, Request, Response } from "express";
import orderModel from "../../DB/Models/order.model.js";
import { AppError } from "../../utils/AppError.js";
import AuthRequest from "../../types/AuthRequest.types.js";

export const getAllUserOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as AuthRequest).authUser._id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await orderModel
      .find({ userId })
      .populate("items.productId", "name price images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!orders || orders.length === 0) {
      return next(new AppError("No orders found for this user", 404));
    }

    const total_results = await orderModel.countDocuments({ userId });
    const total_pages = Math.ceil(total_results / limit);

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      page,
      limit,
      total_pages,
      total_results,
      results: orders,
    });
  } catch (error) {
    next(error);
  }
};

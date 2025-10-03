import { NextFunction, Request, Response } from "express";
import orderModel from "../../DB/Models/order.model.js";
import { AppError } from "../../utils/AppError.js";

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await orderModel
      .find()
      .populate("userId", "userName email name")
      .populate("items.productId", "name price images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!orders || orders.length === 0)
      return next(new AppError("No orders found", 404));
    
    const total_results = await orderModel.countDocuments();
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

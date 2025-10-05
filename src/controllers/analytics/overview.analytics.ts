import { NextFunction, Request, Response } from "express";
import productModel from "../../DB/Models/product.model.js";
import orderModel from "../../DB/Models/order.model.js";
import User from "../../DB/Models/user.model.js";

export const overviewAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const totalProducts = await productModel.countDocuments();
    const totalOrders = await orderModel.countDocuments();
    const totalRevenue = await orderModel.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, revenue: { $sum: "$totalAmount" } } },
    ]);
    const totalCustomers = await User.countDocuments();

    res.status(200).json({
      success: true,
      message: "Overview fetched successfully",
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.revenue || 0,
      totalCustomers,
    });
  } catch (error) {
    next(error);
  }
};

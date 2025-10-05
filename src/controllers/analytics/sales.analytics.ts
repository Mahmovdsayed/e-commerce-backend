import { NextFunction, Request, Response } from "express";
import orderModel from "../../DB/Models/order.model.js";

export const monthlySales = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const year = parseInt(req.query.year as string) || new Date().getFullYear();

    const sales = await orderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
          status: { $ne: "cancelled" },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    res.status(200).json({
      success: true,
      message: "Monthly sales fetched successfully",
      data: sales,
    });
  } catch (error) {
    next(error);
  }
};

import { NextFunction, Request, Response } from "express";
import productModel from "../../DB/Models/product.model.js";
import { isValidObjectId } from "mongoose";
import { AppError } from "../../utils/AppError.js";
import orderModel from "../../DB/Models/order.model.js";

export const productAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;
    if (!productId) return next(new AppError("Product ID is required", 400));

    if (!isValidObjectId(productId))
      return next(new AppError("Invalid Product ID", 400));

    const product = await productModel.findById(productId).populate("reviews");

    if (!product) return next(new AppError("Product not found", 404));

    const sales = await orderModel.aggregate([
      { $unwind: "$items" },
      { $match: { "items.productId": product._id } },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Product analytics fetched successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

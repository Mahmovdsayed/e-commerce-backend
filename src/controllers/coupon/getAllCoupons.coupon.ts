import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import couponModel from "../../DB/Models/coupon.model.js";

export const getAllCoupons = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {

    const authUser = (req as any).authUser;
    if (authUser.role !== "admin") return next(new AppError("Forbidden access", 403));

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const total_results = await couponModel.countDocuments();
    const total_pages = Math.ceil(total_results / limit);

    const skip = (page - 1) * limit;
    const coupons = await couponModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Coupons fetched successfully",
      page,
      limit,
      total_pages,
      total_results,
      results: coupons,
    });
    
  } catch (error) {
    next(error);
  }
};

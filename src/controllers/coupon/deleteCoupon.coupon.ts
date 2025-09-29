import { NextFunction, Request, Response } from "express";
import AuthRequest from "../../types/AuthRequest.types.js";
import { AppError } from "../../utils/AppError.js";
import couponModel from "../../DB/Models/coupon.model.js";
import { isValidObjectId } from "mongoose";

export const deleteCouponHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { couponId } = req.params;

    if (!couponId) return next(new AppError("Coupon ID is required", 400));
    if(!isValidObjectId(couponId)) return next(new AppError("Invalid coupon ID", 400));

    const authUser = (req as AuthRequest).authUser;
    if (authUser.role !== "admin") return next(new AppError("Forbidden access", 403));

    const coupon = await couponModel.findById(couponId);
    if (!coupon) return next(new AppError("Coupon not found", 404));

    await couponModel.findByIdAndDelete(couponId);
    
    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};

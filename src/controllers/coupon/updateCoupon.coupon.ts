import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import AuthRequest from "../../types/AuthRequest.types.js";
import { isValidObjectId } from "mongoose";
import couponModel from "../../DB/Models/coupon.model.js";
import redis from "../../helpers/redis.js";

export const updateCouponHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      isActive,
      code,
      discountType,
      discountValue,
      expirationDate,
      usageLimit,
      minPurchaseAmount,
      products,
    } = req.body;

    const { couponId } = req.params;
    if (!couponId) return next(new AppError("Coupon ID is required", 400));
    if (!isValidObjectId(couponId))
      return next(new AppError("Invalid coupon ID", 400));

    const authUser = (req as AuthRequest).authUser;
    if (authUser.role !== "admin")
      return next(new AppError("Forbidden access", 403));

    const coupon = await couponModel.findById(couponId);
    if (!coupon) return next(new AppError("Coupon not found", 404));

    const normalizedCode = code.trim().toUpperCase();
    const existingCoupon = await couponModel.findOne({ code: normalizedCode });
    if (existingCoupon)
      return next(new AppError("Coupon with this code already exists", 409));

    if (products?.length > 0) {
      const conflictingCoupons = await couponModel.find({
        products: { $in: products },
        _id: { $ne: couponId },
      });

      if (conflictingCoupons.length > 0) {
        return next(
          new AppError("One or more products already has a coupon", 409)
        );
      }
    }

    if (discountType === "percentage" && discountValue > 100)
      return next(new AppError("Discount value cannot exceed 100%", 400));

    if (expirationDate && new Date(expirationDate) < new Date())
      return next(new AppError("Expiration date cannot be in the past", 400));

    if (usageLimit && usageLimit < 0)
      return next(new AppError("Usage limit cannot be negative", 400));

    if (minPurchaseAmount && minPurchaseAmount < 0)
      return next(new AppError("Min purchase amount cannot be negative", 400));

    const updatedCoupon = await couponModel.findByIdAndUpdate(
      couponId,
      {
        isActive,
        code: normalizedCode,
        discountType,
        discountValue,
        expirationDate,
        usageLimit,
        minPurchaseAmount,
        products,
      },
      { new: true }
    );
    await redis.del("coupons:all");
    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: updatedCoupon,
    });
  } catch (error) {
    next(error);
  }
};

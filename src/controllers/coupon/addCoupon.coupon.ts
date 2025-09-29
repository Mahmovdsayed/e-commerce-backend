import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import couponModel from "../../DB/Models/coupon.model.js";

export const addCouponHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      code,
      discountType,
      discountValue,
      expirationDate,
      usageLimit,
      minPurchaseAmount,
      products,
    } = req.body;

    const authUser = (req as any).authUser;
    if (authUser.role !== "admin")
      return next(new AppError("Forbidden access", 403));

    const existingCoupon = await couponModel.findOne({ code });
    if (existingCoupon) {
      return next(new AppError("Coupon with this code already exists", 409));
    }

    if (products?.length > 0) {
      const conflictingCoupons = await couponModel.find({
        products: { $in: products },
      });

      if (conflictingCoupons.length > 0) {
        return next(
          new AppError("One or more products already has a coupon", 409)
        );
      }
    }

    if (discountType === "percentage" && discountValue > 100)
      return next(new AppError("Discount value cannot exceed 100%", 400));

    if (new Date(expirationDate) < new Date())
      return next(new AppError("Expiration date cannot be in the past", 400));

    if (usageLimit && usageLimit < 0)
      return next(new AppError("Usage limit cannot be negative", 400));

    if (minPurchaseAmount && minPurchaseAmount < 0)
      return next(new AppError("Min purchase amount cannot be negative", 400));

    const newCoupon = await couponModel.create({
      code,
      discountType,
      discountValue,
      expirationDate,
      usageLimit,
      minPurchaseAmount,
      products,
      addedBy: authUser._id,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Coupon added successfully",
      data: newCoupon,
    });
  } catch (error) {
    next(error);
  }
};

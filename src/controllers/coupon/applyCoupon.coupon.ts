import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError.js";
import { isValidObjectId } from "mongoose";
import couponModel from "../../DB/Models/coupon.model.js";
import AuthRequest from "../../types/AuthRequest.types.js";

export const applyCoupon = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code, products, totalAmount } = req.body;

    const userId = (req as AuthRequest).authUser._id;

    if (!code) return next(new AppError("Coupon code is required", 400));

    const now = new Date();

    const coupon = await couponModel.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
      expirationDate: { $gt: now },
      $expr: {
        $lt: ["$usedCount", "$usageLimit"],
      },
      users: { $ne: userId },
    });

    if (!coupon) {
      return next(
        new AppError("Invalid, expired, or already used coupon", 400)
      );
    }

    if (coupon.minPurchaseAmount && totalAmount < coupon.minPurchaseAmount) {
      return next(
        new AppError(
          `Minimum purchase of ${coupon.minPurchaseAmount} required`,
          400
        )
      );
    }

    if (coupon.products.length > 0 && products?.length > 0) {
      const productIds = products.map((p: any) =>
        typeof p === "string" ? p : p._id?.toString()
      );

      const allowed = coupon.products.some((p) =>
        productIds.includes(p.toString())
      );

      if (!allowed) {
        return next(
          new AppError("This coupon is not valid for selected products", 400)
        );
      }
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (coupon.discountValue / 100) * totalAmount;
    } else {
      discount = coupon.discountValue;
    }

    const finalAmount = Math.max(totalAmount - discount, 0);

    coupon.usedCount += 1;
    coupon.users.push(userId as any);
    await coupon.save();

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      coupon: coupon.code,
      discount,
      finalAmount,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError.js";
import couponModel from "../../DB/Models/coupon.model.js";
import productModel from "../../DB/Models/product.model.js";
import AuthRequest from "../../types/AuthRequest.types.js";
import redis from "../../helpers/redis.js";

export const applyCoupons = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { codes, products, totalAmount } = req.body;
    const userId = (req as AuthRequest).authUser._id;

    if (!codes || !Array.isArray(codes) || codes.length === 0) {
      return next(new AppError("At least one coupon code is required", 400));
    }

    if (!products || products.length === 0) {
      return next(new AppError("No products provided", 400));
    }

    const now = new Date();

    const productIds = products.map((p: any) =>
      typeof p === "string" ? p : p._id?.toString()
    );

    const dbProducts = await productModel.find({ _id: { $in: productIds } });
    if (dbProducts.length === 0) {
      return next(new AppError("No valid products found in database", 400));
    }

    let totalDiscount = 0;
    let appliedCoupons: any[] = [];
    let finalAmount = totalAmount;

    for (const code of codes) {
      const coupon = await couponModel.findOne({
        code: code.trim().toUpperCase(),
        isActive: true,
        expirationDate: { $gt: now },
        $expr: { $lt: ["$usedCount", "$usageLimit"] },
        users: { $ne: userId },
      });

      if (!coupon) {
        continue;
      }

      if (coupon.minPurchaseAmount && totalAmount < coupon.minPurchaseAmount) {
        continue;
      }

      let eligibleProducts = dbProducts;
      if (coupon.products.length > 0) {
        eligibleProducts = dbProducts.filter((p) =>
          coupon.products.some((cp) => cp.toString() === cp._id.toString())
        );
        if (eligibleProducts.length === 0) {
          continue;
        }
      }

      const eligibleTotal = eligibleProducts.reduce(
        (sum, p) => sum + (p.price || 0),
        0
      );

      if (eligibleTotal === 0) continue;

      let discount = 0;
      if (coupon.discountType === "percentage") {
        discount = (coupon.discountValue / 100) * eligibleTotal;
      } else {
        discount = coupon.discountValue;
      }

      totalDiscount += discount;
      finalAmount = Math.max(finalAmount - discount, 0);

      appliedCoupons.push({
        coupon: coupon.code,
        discount,
        eligibleProducts: eligibleProducts.map((p) => ({
          id: p._id,
          name: p.name,
          price: p.price,
        })),
      });

      coupon.usedCount += 1;
      coupon.users.push(userId as any);
      await coupon.save();
    }

    if (appliedCoupons.length === 0) {
      return next(new AppError("No valid coupons could be applied", 400));
    }
    await redis.del("coupons:all");

    res.status(200).json({
      success: true,
      message: "Coupons applied successfully",
      appliedCoupons,
      totalDiscount,
      finalAmount,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

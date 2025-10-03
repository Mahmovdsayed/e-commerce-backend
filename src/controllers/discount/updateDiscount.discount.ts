import { NextFunction, Request, Response } from "express";
import AuthRequest from "../../types/AuthRequest.types.js";
import discountModel from "../../DB/Models/discount.model.js";
import redis from "../../helpers/redis.js";
import { AppError } from "../../utils/AppError.js";
import { isValidObjectId } from "mongoose";

export const updateDiscount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { discountId } = req.params;
    if (!discountId) return next(new AppError("Discount id is required", 400));
    if (!isValidObjectId(discountId))
      return next(new AppError("Invalid discount id", 400));

    const authUser = (req as AuthRequest).authUser;
    if (authUser.role !== "admin")
      return next(
        new AppError("You are not authorized to update a discount", 401)
      );

    const {
      code,
      discountType,
      discountValue,
      minCartValue,
      expiresAt,
      isActive,
    } = req.body;
    if (!code || !discountType || !discountValue || !expiresAt) {
      return next(new AppError("Missing required fields", 400));
    }
    const normalizedCode = code.trim().toUpperCase();

    const discount = await discountModel.findById(discountId);
    if (!discount) return next(new AppError("Discount not found", 404));

    if (normalizedCode !== discount.code) {
      const existingDiscount = await discountModel.findOne({
        code: normalizedCode,
      });
      if (existingDiscount)
        return next(new AppError("Discount code already exists", 400));
    }

    if (discountType !== "percentage" && discountType !== "fixed")
      return next(new AppError("Invalid discount type", 400));
    if (discountValue < 0)
      return next(new AppError("Invalid discount value", 400));

    if (minCartValue < 0)
      return next(new AppError("Invalid minimum cart value", 400));
    if (expiresAt && new Date(expiresAt) < new Date())
      return next(new AppError("Expiration date cannot be in the past", 400));

    if (discountType === "percentage" && discountValue > 100)
      return next(new AppError("Discount value cannot be more than 100%", 400));
    if (discountType === "fixed" && discountValue <= 0)
      return next(
        new AppError(
          "Discount value must be greater than 0 for fixed discounts",
          400
        )
      );

    if (
      minCartValue &&
      discountValue >= minCartValue &&
      discountType === "fixed"
    )
      return next(
        new AppError(
          "Discount value cannot be greater than or equal to minimum cart value for fixed discounts",
          400
        )
      );

    discount.code = normalizedCode;
    discount.discountType = discountType;
    discount.discountValue = discountValue;
    discount.minCartValue = minCartValue;
    discount.expiresAt = expiresAt;
    discount.isActive = isActive;

    await discount.save();
    redis.del(`discount`);

    res.status(200).json({
      success: true,
      message: "Discount updated successfully",
      data: discount,
    });
  } catch (error) {
    next(error);
  }
};

import { NextFunction, Request, Response } from "express";
import AuthRequest from "../../types/AuthRequest.types.js";
import discountModel from "../../DB/Models/discount.model.js";
import { AppError } from "../../utils/AppError.js";
import { isValidObjectId } from "mongoose";

export const deleteDiscount = async (
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
        new AppError("You are not authorized to view discounts", 401)
      );

    const discount = await discountModel.findByIdAndDelete(discountId);
    if (!discount) return next(new AppError("Discount not found", 404));

    res.status(200).json({
      success: true,
      message: "Discount deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

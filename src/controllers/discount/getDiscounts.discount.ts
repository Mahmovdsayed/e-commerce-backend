import { NextFunction, Request, Response } from "express";
import AuthRequest from "../../types/AuthRequest.types.js";
import discountModel from "../../DB/Models/discount.model.js";
import { AppError } from "../../utils/AppError.js";

export const getDiscounts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authUser = (req as AuthRequest).authUser;
    if (authUser.role !== "admin")
      return next(
        new AppError("You are not authorized to view discounts", 401)
      );

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const total_results = await discountModel.countDocuments();
    const total_pages = Math.ceil(total_results / limit);

    const skip = (page - 1) * limit;

    const discounts = await discountModel
      .find()
      .select("-__v -addedBy")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!discounts) return next(new AppError("No discounts found", 404));

    res.status(200).json({
      success: true,
      message: "Discounts fetched successfully",
      page,
      limit,
      total_pages,
      total_results,
      results: discounts,
    });
  } catch (error) {
    next(error);
  }
};

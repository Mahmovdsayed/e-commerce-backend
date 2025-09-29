import { NextFunction, Request, Response } from "express";
import AuthRequest from "../../types/AuthRequest.types.js";
import { AppError } from "../../utils/AppError.js";
import reviewModel from "../../DB/Models/review.model.js";

export const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authUser = (req as AuthRequest).authUser;
    if (authUser.role !== "admin")
      return next(
        new AppError("You are not authorized to view all reviews", 401)
      );

    const { productId, rating } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    let filter: any = {};

    if (productId) {
      filter.productId = productId;
    }

    if (rating) {
      const ratingNumber = Number(rating);
      if (isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
        return next(new AppError("Rating filter must be between 1 and 5", 400));
      }
      filter.rating = ratingNumber;
    }

    const total_results = await reviewModel.countDocuments(filter);
    const total_pages = Math.ceil(total_results / limit);
    const skip = (page - 1) * limit;

    const reviews = await reviewModel
      .find(filter)
      .populate("productId", "name price")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (!reviews || reviews.length === 0)
      return next(new AppError("No reviews found", 404));

    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      page,
      limit,
      total_pages,
      total_results,
      results: reviews,
    });
  } catch (error) {
    next(error);
  }
};

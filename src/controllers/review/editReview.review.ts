import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { isValidObjectId } from "mongoose";
import AuthRequest from "../../types/AuthRequest.types.js";
import productModel from "../../DB/Models/product.model.js";
import reviewModel from "../../DB/Models/review.model.js";

export const editReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) return next(new AppError("Review ID is required", 400));
    if (!isValidObjectId(id))
      return next(new AppError("Invalid Review ID", 400));

    const authUser = (req as AuthRequest).authUser;

    const { rating, comment } = req.body;

    if (!rating || !comment) return next(new AppError("Rating and comment are required", 400));
    if (rating < 1 || rating > 5) return next(new AppError("Rating must be between 1 and 5", 400));

    const review = await reviewModel.findById(id);
    if (!review) return next(new AppError("Review not found", 404));

    if (review.userId.toString() !== authUser._id.toString()) return next(new AppError("You are not authorized to edit this review", 401));

    review.rating = rating;
    review.comment = comment;
    await review.save();

    const product = await productModel.findById(review.productId);
    if (!product) return next(new AppError("Product not found", 404));

    const reviews = await reviewModel.find({ productId: product._id });
    product.rating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
    product.numReviews = reviews.length;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

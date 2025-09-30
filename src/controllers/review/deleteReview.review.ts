import { NextFunction, Request, Response } from "express";
import AuthRequest from "../../types/AuthRequest.types.js";
import reviewModel from "../../DB/Models/review.model.js";
import { AppError } from "../../utils/AppError.js";
import { isValidObjectId } from "mongoose";
import productModel from "../../DB/Models/product.model.js";
import redis from "../../helpers/redis.js";

export const deleteReview = async (
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

    const review = await reviewModel.findById(id);
    if (!review) return next(new AppError("Review not found", 404));

    if (
      review.userId.toString() !== authUser._id.toString() ||
      authUser.role !== "admin"
    )
      return next(
        new AppError("You are not authorized to delete this review", 401)
      );

    const product = await productModel.findById(review.productId);
    if (!product) return next(new AppError("Product not found", 404));

    product.reviews = product.reviews.filter(
      (reviewId: any) => reviewId.toString() !== id.toString()
    );

    const reviews = await reviewModel.find({ productId: product._id });
    product.rating =
      reviews.length > 0
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        : 0;
    product.numReviews = reviews.length;

    await product.save();
    await reviewModel.findByIdAndDelete(id);
    await redis.del("reviews:all");
    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { isValidObjectId } from "mongoose";
import reviewModel from "../../DB/Models/review.model.js";
import productModel from "../../DB/Models/product.model.js";

export const addReview = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const authUser = (req as any).authUser;

    if (!productId) return next(new AppError("Product ID is required", 400));
    if (!isValidObjectId(productId))
      return next(new AppError("Invalid Product ID", 400));
    if (!rating || !comment)
      return next(new AppError("Rating and comment are required", 400));
    if (rating < 1 || rating > 5)
      return next(new AppError("Rating must be between 1 and 5", 400));

    const product = await productModel.findById(productId);
    if (!product) return next(new AppError("Product not found", 404));

    const existingReview = await reviewModel.findOne({
      productId,
      userId: authUser._id,
    });
    if (existingReview) {
      return next(new AppError("You already reviewed this product", 400));
    }

    const review = await reviewModel.create({
      productId,
      userId: authUser._id,
      rating,
      comment,
    });

    product.reviews.push(review._id);

    const reviews = await reviewModel.find({ productId });

    product.rating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
    product.numReviews = reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

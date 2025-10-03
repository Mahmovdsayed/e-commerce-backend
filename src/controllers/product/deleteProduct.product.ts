import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError.js";
import redis from "../../helpers/redis.js";
import categoryModel from "../../DB/Models/category.model.js";
import productModel from "../../DB/Models/product.model.js";
import { isValidObjectId } from "mongoose";
import AuthRequest from "../../types/AuthRequest.types.js";
import reviewModel from "../../DB/Models/review.model.js";
import { deleteImageFromCloudinary } from "../../helpers/uploadImageToCloudinary.js";

export const deleteProductHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) return next(new AppError("Product ID is required", 400));
    if (!isValidObjectId(id))
      return next(new AppError("Invalid Product ID", 400));

    const product = await productModel.findById(id);
    if (!product) return next(new AppError("Product not found", 404));

    const category = await categoryModel.findById(product.categoryId);
    if (!category) return next(new AppError("Category not found", 404));

    category.products = category.products.filter(
      (productId) => productId.toString() !== id.toString()
    );
    await category.save();

    await reviewModel.deleteMany({ productId: product._id });

    if (product.images?.length) {
      for (const image of product.images) {
        if (image.public_id) {
          try {
            await deleteImageFromCloudinary(image.public_id);
          } catch (err) {
            console.error(`Failed to delete image ${image.public_id}`, err);
          }
        }
      }
    }

    await productModel.findByIdAndDelete(id);

    await redis.del(`product`);
    await redis.del("products:all");

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

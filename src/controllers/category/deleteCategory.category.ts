import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { isValidObjectId } from "mongoose";
import AuthRequest from "../../types/AuthRequest.types.js";
import categoryModel from "../../DB/Models/category.model.js";
import { deleteImageFromCloudinary } from "../../helpers/uploadImageToCloudinary.js";
import redis from "../../helpers/redis.js";

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) return next(new AppError("Category id is required", 400));
    if (!isValidObjectId(id))
      return next(new AppError("Invalid category id", 400));

    const category = await categoryModel.findById(id);
    if (!category) return next(new AppError("Category not found", 404));

    if (category.products.length > 0)
      return next(
        new AppError(
          "Category has products , you can't delete it , please delete products first",
          400
        )
      );

    if (category.image?.public_id) {
      try {
        await deleteImageFromCloudinary(category.image.public_id);
      } catch (error) {
        next(error);
      }
    }
    await categoryModel.findByIdAndDelete(id);
    await redis.del("categories:all");
    await redis.del("category");
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

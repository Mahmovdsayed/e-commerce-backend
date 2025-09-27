import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { isValidObjectId } from "mongoose";
import categoryModel from "../../DB/Models/category.model.js";

export const getCategoryInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (!id) return next(new AppError("Category id is required", 400));
    if (!isValidObjectId(id))
      return next(new AppError("Invalid category id", 400));

    const category = await categoryModel.findById(id);
    if (!category) return next(new AppError("Category not found", 404));

    const total_results = await categoryModel
      .findById(id)
      .populate("products")
      .then((cat) => cat?.products?.length || 0);

    const total_pages = Math.ceil(total_results / limit);
    const skip = (page - 1) * limit;

    const categoryWithProducts = await categoryModel.findById(id).populate({
      path: "products",
      options: {
        sort: { createdAt: -1 },
        skip,
        limit,
      },
    });

    res.status(200).json({
      success: true,
      message: "Category info fetched successfully",
      page,
      limit,
      total_pages,
      total_results,
      results: categoryWithProducts,
    });
  } catch (error) {
    next(error);
  }
};

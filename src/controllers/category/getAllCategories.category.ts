import { NextFunction, Request, Response } from "express";
import categoryModel from "../../DB/Models/category.model.js";

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const total_results = await categoryModel.countDocuments();
    const total_pages = Math.ceil(total_results / limit);

    const skip = (page - 1) * limit;

    const categories = await categoryModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      page,
      limit,
      total_pages,
      total_results,
      results: categories,
    });
  } catch (error) {
    next(error);
  }
};

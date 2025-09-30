import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { isValidObjectId } from "mongoose";
import productModel from "../../DB/Models/product.model.js";

export const getProductInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) return next(new AppError("Product ID is required", 400));
    if (!isValidObjectId(id))
      return next(new AppError("Invalid Product ID", 400));

    const product = await productModel
      .findById(id)
      .populate("categoryId", "name slug image.url")
      .select("-__v -reviews -addedBy");
    if (!product) return next(new AppError("Product not found", 404));
    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

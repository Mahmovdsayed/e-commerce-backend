import { NextFunction, Request, Response } from "express";
import { generateDescriptionViaGemini } from "../../Integrations/gemini.js";
import { AppError } from "../../utils/AppError.js";
import { isValidObjectId } from "mongoose";
import productModel from "../../DB/Models/product.model.js";

export const generateDescription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;
    if (!productId) return next(new AppError("Product ID is required", 400));
    if (!isValidObjectId(productId))
      return next(new AppError("Invalid Product ID", 400));

    const product = await productModel.findById(productId);
    if (!product) return next(new AppError("Product not found", 404));

    const { productName, category, brief } = req.body;
    const description = await generateDescriptionViaGemini(
      productName,
      category,
      brief
    );

    product.ai.description = description;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Description generated successfully",
      data: description,
    });
    
  } catch (error) {
    next(error);
  }
};

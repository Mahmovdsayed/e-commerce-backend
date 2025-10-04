import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { isValidObjectId } from "mongoose";
import productModel from "../../DB/Models/product.model.js";
import { generateSeoViaGemini } from "../../Integrations/gemini.js";

export const generateSeoHandler = async (
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

    const { productName, category, description, tags, materials } = req.body;

    const seo = await generateSeoViaGemini(
      productName,
      category,
      description,
      tags,
      materials
    );

    product.ai.seo = seo;
    await product.save();

    res.status(200).json({
      success: true,
      message: "SEO generated successfully",
      data: seo,
    });
  } catch (error) {
    next(error);
  }
};

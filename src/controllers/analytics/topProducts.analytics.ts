import { NextFunction, Request, Response } from "express";
import productModel from "../../DB/Models/product.model.js";

export const TopProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;
    if (limit <= 0) {
      res.status(400).json({
        success: false,
        message: "Limit must be a positive number",
      });
      return;
    }

    const topProducts = await productModel
      .find()
      .sort({ sold: -1 })
      .limit(limit)
      .select("name sold price");

    res.status(200).json({
      success: true,
      message: "Top products fetched successfully",
      data: topProducts,
    });
  } catch (error) {
    next(error);
  }
};

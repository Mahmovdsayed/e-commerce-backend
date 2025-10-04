import { NextFunction, Request, Response } from "express";
import {
  generateDescriptionViaGemini,
  generateDetailedMarketingPlan,
} from "../../Integrations/gemini.js";
import { AppError } from "../../utils/AppError.js";
import { isValidObjectId } from "mongoose";
import productModel from "../../DB/Models/product.model.js";

export const MarketingPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { platform, audience, tone, productName, category, description } = req.body;
    
    const marketingPlan = await generateDetailedMarketingPlan(
      productName,
      category,
      description,
      platform,
      audience,
      tone
    );

    res.status(200).json({
      success: true,
      message: "Marketing plan generated successfully",
      data: marketingPlan,
    });
  } catch (error) {}
};

import { Request, Response, NextFunction } from "express";
import productModel from "../../DB/Models/product.model.js";
import { AppError } from "../../utils/AppError.js";
import AuthRequest from "../../types/AuthRequest.types.js";
import { isValidObjectId } from "mongoose";
import categoryModel from "../../DB/Models/category.model.js";
import redis from "../../helpers/redis.js";

export const updateProductHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) return next(new AppError("Product ID is required", 400));
    if (!isValidObjectId(id))
      return next(new AppError("Invalid Product ID", 400));

    const authUser = (req as AuthRequest).authUser;
    if (authUser.role !== "admin")
      return next(new AppError("Forbidden access", 403));

    const {
      name,
      description,
      price,
      stock,
      categoryId,
      seo,
      purchase_limit,
      isActive,
      warranty,
      condition,
      shipping,
      materials,
      tags,
      dimensions,
      options,
      attributes,
      colors,
      sizes,
    } = req.body;

    if (!name || !price || !categoryId)
      return next(new AppError("Missing required fields", 400));

    const category = await categoryModel.findById(categoryId);
    if (!category) return next(new AppError("Category not found", 404));

    const existingProduct = await productModel.findOne({
      name,
      _id: { $ne: id },
    });
    if (existingProduct)
      return next(new AppError("Product with this name already exists", 409));

    if (price < 0 || stock < 0 || purchase_limit < 0)
      return next(
        new AppError("Price, stock, and purchase limit cannot be negative", 400)
      );

    if (purchase_limit > stock)
      return next(
        new AppError("Purchase limit cannot be greater than stock", 400)
      );

    if (categoryId !== category.id) {
      const oldCategory = await categoryModel.findById(category.id);
      if (oldCategory) {
        oldCategory.products = oldCategory.products.filter(
          (productId) => productId.toString() !== id
        );
        await oldCategory.save();
      }
      category.products.push(id as any);
      await category.save();
    }

    const product = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        stock,
        categoryId,
        seo,
        purchase_limit,
        isActive,
        warranty,
        condition,
        shipping,
        materials,
        tags,
        dimensions,
        options,
        attributes,
        colors,
        sizes,
      },
      { new: true }
    );

    if (!product) return next(new AppError("Product not found", 404));
    await redis.del("products:all");
    await redis.del("product");

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

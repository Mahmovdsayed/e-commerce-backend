import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { isValidObjectId } from "mongoose";
import productModel from "../../DB/Models/product.model.js";

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const {
      name,
      categoryId,
      minPrice,
      maxPrice,
      minStock,
      maxStock,
      isActive,
      sortBy,
      sortOrder,
      tags,
      search,
    } = req.query;

    let filter: any = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    if (categoryId) {
      if (!isValidObjectId(categoryId)) {
        return next(new AppError("Invalid Category ID", 400));
      }
      filter.categoryId = categoryId;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    if (minStock || maxStock) {
      filter.stock = {};
      if (minStock) {
        filter.stock.$gte = Number(minStock);
      }
      if (maxStock) {
        filter.stock.$lte = Number(maxStock);
      }
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    if (tags) {
      filter.tags = { $in: (tags as string).split(",") };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    let sort: any = {};
    if (sortBy) {
      sort[sortBy as string] = sortOrder === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    const total_results = await productModel.countDocuments(filter);
    const total_pages = Math.ceil(total_results / limit);

    const products = await productModel
      .find(filter)
      .populate("categoryId", "name slug image.url")
      .select("-__v -reviews -addedBy")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (!products || products.length === 0) {
      return next(new AppError("No products found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      page,
      limit,
      total_pages,
      total_results,
      results: products,
    });
  } catch (error) {
    next(error);
  }
};

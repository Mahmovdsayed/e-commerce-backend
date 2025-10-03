import { NextFunction, Request, Response } from "express";
import AuthRequest from "../../types/AuthRequest.types.js";
import { AppError } from "../../utils/AppError.js";
import { isValidObjectId } from "mongoose";
import categoryModel from "../../DB/Models/category.model.js";
import { updateImageInCloudinary } from "../../helpers/uploadImageToCloudinary.js";
import { slugifyText } from "../../helpers/slugify.js";
import redis from "../../helpers/redis.js";

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) return next(new AppError("Category id is required", 400));
    if (!isValidObjectId(id))
      return next(new AppError("Invalid category id", 400));

    const { name, description, metaTitle, metaDescription, slug } = req.body;
    const image = req.file;

    if (!name || !name.trim())
      return next(new AppError("Name is required", 400));

    const category = await categoryModel.findById(id);
    if (!category) return next(new AppError("Category not found", 404));

    const newSlug = slugifyText(name);
    const existingCategory = await categoryModel.findOne({
      slug: newSlug,
      _id: { $ne: id },
    });
    if (existingCategory) {
      return next(new AppError("Category with this name already exists", 409));
    }

    let public_id = category.image?.public_id ?? "";
    let url = category.image?.url ?? "";

    if (image && image.size > 0) {
      try {
        const { imageUrl, publicId } = await updateImageInCloudinary(
          image,
          "categories",
          category.image?.public_id
        );
        public_id = publicId;
        url = imageUrl;
      } catch (error) {
        return next(new AppError("Image upload failed", 500));
      }
    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        metaTitle,
        metaDescription,
        slug: newSlug,
        image: { url, public_id },
      },
      { new: true }
    );
    await redis.del("categories:all");
    await redis.del("category");
    res.status(200).json({
      status: "success",
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

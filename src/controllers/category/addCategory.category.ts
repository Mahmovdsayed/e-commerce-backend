import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { uploadImageToCloudinary } from "../../helpers/uploadImageToCloudinary.js";
import categoryModel from "../../DB/Models/category.model.js";
import { imageNotFoundURL } from "../../utils/statics.js";
import { slugifyText } from "../../helpers/slugify.js";
import AuthRequest from "../../types/AuthRequest.types.js";


export const addCategoryHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authUser = (req as AuthRequest).authUser;

    if (authUser.role !== "admin") {
      return next(new AppError("Forbidden access", 403));
    }

    const { name, description, metaTitle, metaDescription } = req.body;
    const image = req.file;
    if (!name) throw new AppError("Name is required", 400);
    if (!image) throw new AppError("Image is required", 400);

    let imageUrl = imageNotFoundURL;
    let publicId = "";

    if (image && image.size > 0) {
      try {
        const uploadResult = await uploadImageToCloudinary(image, "categories");
        if (uploadResult) {
          imageUrl = uploadResult.imageUrl;
          publicId = uploadResult.publicId;
        }
      } catch (error) {
        return next(new AppError("Image upload failed", 500));
      }
    }

    const slug = slugifyText(name);

    const existingCategory = await categoryModel.findOne({ slug });
    if (existingCategory) {
      return next(new AppError("Category with this name already exists", 409));
    }

    const newCategory = await categoryModel.create({
      name,
      slug,
      description,
      metaTitle: metaTitle?.trim() || name,
      metaDescription:
        metaDescription?.trim() || description || `${name} category`,
      image: { url: imageUrl, public_id: publicId || null },
      addedBy: authUser._id,
    });

    res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

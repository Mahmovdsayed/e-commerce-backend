import { Request, Response, NextFunction } from "express";
import productModel from "../../DB/Models/product.model.js";
import { AppError } from "../../utils/AppError.js";
import AuthRequest from "../../types/AuthRequest.types.js";
import { imageNotFoundURL } from "../../utils/statics.js";
import { uploadImageToCloudinary } from "../../helpers/uploadImageToCloudinary.js";
import categoryModel from "../../DB/Models/category.model.js";

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
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

    const category = await categoryModel.findById(categoryId);
    if (!category) return next(new AppError("Category not found", 404));

    if (!name || !price || !categoryId)
      return next(new AppError("Missing required fields", 400));

    const existingProduct = await productModel.findOne({ name });
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

    let uploadedImages: { url: string; public_id: string }[] = [];

    if (req.files && Array.isArray(req.files)) {
      uploadedImages = await Promise.all(
        req.files.map(async (file: any) => {
          try {
            const result = await uploadImageToCloudinary(
              file,
              `products/${name.trim().toLowerCase()}`
            );
            return { url: result.imageUrl, public_id: result.publicId };
          } catch (err) {
            console.error("Image upload failed:", err);
            return { url: imageNotFoundURL, public_id: "" };
          }
        })
      );
    } else {
      uploadedImages = [{ url: imageNotFoundURL, public_id: "" }];
    }

    const product = new productModel({
      name,
      description,
      price,
      stock,
      categoryId,
      images: uploadedImages,
      seo: {
        keywords: seo?.keywords || [],
        metaTitle: seo?.metaTitle || name || "",
        metaDescription: seo?.metaDescription || description || "",
      },
      purchase_limit,
      warranty,
      condition,
      shipping,
      materials,
      tags,
      dimensions,
      addedBy: authUser._id,
      options,
      attributes,
      colors,
      sizes,
      isActive: true,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

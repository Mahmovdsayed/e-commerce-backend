import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { isValidObjectId } from "mongoose";
import User from "../../DB/Models/user.model.js";

export const getUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const authUser = (req as any).authUser;

    if (!id) return next(new AppError("User ID is required", 400));
    if (!isValidObjectId(id)) return next(new AppError("Invalid User ID", 400));

    if (id !== authUser._id.toString() && authUser.role !== "admin")
      return next(new AppError("Forbidden access", 403));

    const user = await User.findById(id)
      .select("-password -otp -otpExpiry -refreshToken -__v")
      .lean();
    if (!user) return next(new AppError("User not found", 404));

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

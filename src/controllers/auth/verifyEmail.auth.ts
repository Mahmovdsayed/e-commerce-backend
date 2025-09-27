import { NextFunction, Request, Response } from "express";
import User from "../../DB/Models/user.model.js";
import { AppError } from "../../utils/AppError.js";

export const verifyEmailHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(new AppError("Email and OTP are required", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (!user.otp || !user.otpExpiry) {
      return next(new AppError("No OTP found. Please request a new one.", 400));
    }

    if (user.otp !== otp.trim()) {
      return next(new AppError("Invalid OTP", 400));
    }

    const otpExpiry = new Date(user.otpExpiry);
    if (otpExpiry.getTime() < Date.now()) {
      return next(
        new AppError("OTP has expired. Please request a new one.", 400)
      );
    }

    user.otp = undefined as any;
    user.otpExpiry = undefined as any;
    user.isVerified = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

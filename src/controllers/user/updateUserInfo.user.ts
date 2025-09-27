import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { isValidObjectId } from "mongoose";
import User from "../../DB/Models/user.model.js";
import sendEmailService from "../../utils/email.js";
import { generateOTP } from "../../helpers/generateOTP.js";

export const updateUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const authUser = (req as any).authUser;

    if (!id) return next(new AppError("User ID is required", 400));
    if (!isValidObjectId(id)) return next(new AppError("Invalid User ID", 400));

    if (id !== authUser._id.toString() && authUser.role !== "admin") {
      return next(new AppError("Forbidden access", 403));
    }

    const { name, email, address } = req.body;

    const { street, city, country, postalCode, phone } = address || {};

    if (
      !name &&
      !email &&
      !street &&
      !city &&
      !country &&
      !postalCode &&
      !phone
    ) {
      return next(new AppError("Name, email or address is required", 400));
    }

    if (email) {
      const isEmailTaken = await User.findOne({ email, _id: { $ne: id } });
      if (isEmailTaken)
        return next(new AppError("Email is already taken", 409));
    }

    const updateData: Partial<{
      name: string;
      email: string;
      isVerified?: boolean;
      otp?: string;
      otpExpiry?: Date;
      address?: {
        street?: string;
        city?: string;
        country?: string;
        postalCode?: string;
        phone?: string;
      };
    }> = {};
    let sendVerification = false;

    if (name) updateData.name = name;
    if (email) {
      updateData.email = email;
      if (email !== authUser.email) {
        sendVerification = true;
        updateData.isVerified = false;

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        updateData.otp = otp;
        updateData.otpExpiry = otpExpiry;
      }
    }

    if (street || city || country || postalCode || phone) {
      updateData.address = { street, city, country, postalCode, phone };
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      select: "_id name email isVerified avatar address",
    });

    if (!user) return next(new AppError("User not found", 404));

    if (sendVerification) {
      await sendEmailService({
        to: user.email,
        subject: "Email Verification Required",
        message: `Your email has been changed. Please verify your new email address. Your OTP is ${updateData.otp}. It will expire in 10 minutes.`,
      }).catch((err) => console.error("Email send failed:", err));
    }

    res.status(200).json({
      success: true,
      message: sendVerification
        ? "User updated successfully, please verify your new email address"
        : "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

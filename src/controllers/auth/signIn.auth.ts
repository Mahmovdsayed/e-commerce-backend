import { NextFunction, Request, Response } from "express";
import User from "../../DB/Models/user.model.js";
import { verifyPassword } from "../../helpers/hashPassword.js";
import { AppError } from "../../utils/AppError.js";
import { hashToken } from "../../helpers/hashToken.js";
import jwt from "jsonwebtoken";

export const signInHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("All fields are required", 400));
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(new AppError("Invalid credentials", 401));
    }

    if (existingUser.provider !== "local") {
      return next(
        new AppError("Please use your Google account to sign in", 400)
      );
    }

    if (!existingUser.isVerified) {
      return next(
        new AppError("Please verify your email before signing in", 400)
      );
    }

    const isPasswordValid = await verifyPassword(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return next(new AppError("Invalid credentials", 401));
    }

    const accessToken = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      process.env.LOGIN_SIG || "",
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: existingUser._id },
      process.env.REFRESH_SIG || "",
      { expiresIn: "30d" }
    );

    existingUser.refreshToken = hashToken(refreshToken);
    await existingUser.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      success: true,
      message: `User signed in successfully`,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

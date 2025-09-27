import { NextFunction, Request, Response } from "express";
import User from "../../DB/Models/user.model.js";
import { AppError } from "../../utils/AppError.js";

export const signOutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return next(new AppError("No refresh token", 400));

    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

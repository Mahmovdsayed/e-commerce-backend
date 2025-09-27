import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../DB/Models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { hashToken } from "../../helpers/hashToken.js";

export const refreshTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return next(new AppError("No refresh token", 401));

    const hashed = hashToken(refreshToken);
    const user = await User.findOne({ refreshToken: hashed });
    if (!user) return next(new AppError("Invalid refresh token", 403));

    jwt.verify(
      refreshToken,
      process.env.REFRESH_SIG!,
      async (err: any, decoded: any) => {
        if (err)
          return next(new AppError("Invalid or expired refresh token", 403));

        const newAccessToken = jwt.sign(
          { id: user._id, role: user.role },
          process.env.LOGIN_SIG!,
          { expiresIn: "15m" }
        );

        const newRefreshToken = jwt.sign(
          { id: user._id },
          process.env.REFRESH_SIG!,
          { expiresIn: "30d" }
        );

        user.refreshToken = hashToken(newRefreshToken);
        await user.save();

        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.json({ success: true, accessToken: newAccessToken });
      }
    );
  } catch (error) {
    next(error);
  }
};

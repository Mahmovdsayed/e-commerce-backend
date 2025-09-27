import { NextFunction, Request, Response } from "express";
import User from "../../DB/Models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { hashToken } from "../../helpers/hashToken.js";
import { hashPassword, verifyPassword } from "../../helpers/hashPassword.js";
import sendEmailService from "../../utils/email.js";

export const resetPasswordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, token, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return next(
        new AppError("New password and confirm password do not match", 400)
      );
    }

    if (!email || !token || !newPassword)
      return next(new AppError("All fields are required", 400));

    const hashedToken = hashToken(token);
    const user = await User.findOne({ email, resetPasswordToken: hashedToken });

    if (!user)
      return next(
        new AppError(
          "Invalid or expired reset password token. Please request a new one.",
          400
        )
      );
    if (
      !user.resetPasswordExpires ||
      user.resetPasswordExpires.getTime() < Date.now()
    ) {
      return next(
        new AppError(
          "Invalid or expired reset password token. Please request a new one.",
          400
        )
      );
    }

    if (await verifyPassword(newPassword, user.password)) {
      return next(
        new AppError(
          "New password must be different from the old password",
          400
        )
      );
    }

    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = undefined as any;
    user.resetPasswordExpires = undefined as any;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });

    sendEmailService({
      to: email,
      subject: "Password Reset Successful",
      message: `Your password has been reset successfully.`,
    }).catch((err) => console.error("Email send failed:", err));
  } catch (error) {
    next(error);
  }
};

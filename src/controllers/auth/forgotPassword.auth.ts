import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { AppError } from "../../utils/AppError.js";
import User from "../../DB/Models/user.model.js";
import sendEmailService from "../../utils/email.js";

export const forgotPasswordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) return next(new AppError("Email is required", 400));

    const user = await User.findOne({ email });
    if (!user) return next(new AppError("User not found", 404));

    if (
      user.resetPasswordExpires &&
      user.resetPasswordExpires.getTime() > Date.now()
    ) {
      const remainingTime = Math.ceil(
        (user.resetPasswordExpires.getTime() - Date.now()) / 60000
      );
      return next(
        new AppError(
          `Please wait ${remainingTime} minutes before requesting a new password reset.`,
          400
        )
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}&email=${email}`;

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });

    await sendEmailService({
      to: email,
      subject: "Password Reset Request",
      message: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; font-size: 14px;">
          <h2>Hello, ${user.name}!</h2>
          <p>You requested to reset your password. Please click the link below:</p>
          <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; text-align: center;">
            <a href="${resetLink}" style="color: #007bff; text-decoration: none; font-weight: bold;">Reset My Password</a>
          </div>
          <p style="color: #d9534f; font-weight: bold;">
            ⚠️ This link will expire in 1 hour.
          </p>
          <p>If you didn’t request this, you can ignore this email.</p>
          <br/>
          <p>Best regards,</p>
          <p><strong>NEST STUDIO TEAM</strong></p>
          <hr/>
          <p style="font-size: 12px; color: #555;">
            This is an automated message, please do not reply.<br/>
            &copy; ${new Date().getFullYear()} NEST STUDIO. All rights reserved.
          </p>
        </div>
      `,
    }).catch((err) => console.error("Email send failed:", err));
  } catch (error) {
    next(error);
  }
};

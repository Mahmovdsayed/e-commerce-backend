import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import User from "../../DB/Models/user.model.js";
import { generateOTP } from "../../helpers/generateOTP.js";
import sendEmailService from "../../utils/email.js";

export const requestNewOTPHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) return next(new AppError("Email is required", 400));

    const user = await User.findOne({ email });
    if (!user) return next(new AppError("User not found", 404));
    if (user.isVerified)
      return next(new AppError("Email is already verified", 400));

    const now = new Date();
    const otpExpiry = user.otpExpiry ? new Date(user.otpExpiry) : new Date(0);

    if (otpExpiry > now) {
      const remainingTime = Math.ceil(
        (otpExpiry.getTime() - now.getTime()) / 60000
      );
      return next(
        new AppError(
          `Please wait ${remainingTime} minutes before requesting a new OTP.`,
          400
        )
      );
    }

    const newOTP = generateOTP();
    const newOtpExpiry = new Date(now.getTime() + 10 * 60 * 1000); 
    user.otp = newOTP;
    user.otpExpiry = newOtpExpiry;
    await user.save();

    res.status(200).json({
      success: true,
      message: "New OTP sent to your email",
    });

    await sendEmailService({
      to: email,
      subject: "Your New OTP Code",
      message: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; font-size: 14px;">
          <h2>Hello, ${user.name}!</h2>
          <p>You requested a new OTP to verify your email. Please use the OTP below:</p>
          
          <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; font-weight: bold; text-align: center;">
            ${newOTP}
          </div>

          <p style="color: #d9534f; font-weight: bold;">
            ⚠️ Note: This OTP will expire in 10 minutes.
          </p>

          <p>If you didn’t request this, you can safely ignore this email.</p>
          
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

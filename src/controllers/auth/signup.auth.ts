import { NextFunction, Request, Response } from "express";
import User from "../../DB/Models/user.model.js";
import { AppError } from "../../utils/AppError.js";
import { hashPassword } from "../../helpers/hashPassword.js";
import { generateOTP } from "../../helpers/generateOTP.js";
import sendEmailService from "../../utils/email.js";

export const signUpHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return next(new AppError("All fields are required", 400));

    const existingUser = await User.findOne({ email });
    if (existingUser) return next(new AppError("User already exists", 400));

    const hashedPassword = await hashPassword(password);
    const otp = generateOTP();
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "customer",
      isVerified: false,
      otp,
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      avatar:
        "https://res.cloudinary.com/dxvpvtcbg/image/upload/v1713493679/sqlpxs561zd9oretxkki.jpg",
      provider: "local",
    });

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });

    sendEmailService({
      to: email,
      subject: "Verify Your Email - OTP Code",
      message: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; font-size: 14px;">
      <h2 style="margin-bottom: 10px;">Welcome, ${name}!</h2>
      <p>Thank you for signing up. To complete your registration, please verify your email using the OTP below:</p>
      
      <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; font-weight: bold; text-align: center;">
        ${otp}
      </div>

      <p style="color: #d9534f; font-weight: bold;">
        ⚠️ Note: This OTP will expire in 10 minutes.
      </p>

      <p>If you didn’t request this, you can safely ignore this email.</p>
      
      <br/>
      <p>Best regards,</p>
      <p><strong>NEST STUDIO TEAM</strong></p>
      <hr style="margin: 20px 0;" />
      <div style="font-size: 12px; color: #555;">
        <p>This is an automated message, please do not reply.</p>
        <p>&copy; ${new Date().getFullYear()} NEST STUDIO. All rights reserved.</p>
      </div>
    </div>
  `,
    }).catch((err) => console.error("Email send failed:", err));
  } catch (error) {
    next(error);
  }
};

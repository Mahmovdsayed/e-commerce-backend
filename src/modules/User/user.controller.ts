import { NextFunction, Request, Response } from "express";
import User from "../../DB/Models/user.model.js";
import { hashPassword } from "../../helpers/hashPassword.js";
import sendEmailService from "../../utils/email.js";
import { AppError } from "../../utils/AppError.js";
import { generateOTP } from "../../helpers/generateOTP.js";

const signUpHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return next(new AppError("User already exists", 400));

    const hashedPassword = await hashPassword(password);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "customer",
      isVerified: false,
      otp: generateOTP(),
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });

    sendEmailService({
      to: email,
      subject: "Welcome to Our Platform!",
      message: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; font-size: 14px;">
      <h2 style="margin-bottom: 10px;">Welcome, ${name}!</h2>
      <p>Thank you for signing up. We're excited to have you on board.</p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
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

const signInHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {};

const signOutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {};

const getUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {};

const updateUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {};

const deleteUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {};

export {
  signUpHandler,
  signInHandler,
  signOutHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler,
};

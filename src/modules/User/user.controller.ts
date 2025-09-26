import { NextFunction, Request, Response } from "express";
import User from "../../DB/Models/user.model.js";
import { hashPassword, verifyPassword } from "../../helpers/hashPassword.js";
import sendEmailService from "../../utils/email.js";
import { AppError } from "../../utils/AppError.js";
import { generateOTP } from "../../helpers/generateOTP.js";
import jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";

const signUpHandler = async (
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
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return next(new AppError("All fields are required", 400));

    const existingUser = await User.findOne({ email });
    if (!existingUser) return next(new AppError("Invalid credentials", 401));

    if (!existingUser.isVerified)
      return next(
        new AppError("Please verify your email before signing in", 400)
      );

    const isPasswordValid = await verifyPassword(
      password,
      existingUser.password
    );
    if (!isPasswordValid) return next(new AppError("Invalid credentials", 401));

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

    existingUser.refreshToken = refreshToken;
    await existingUser.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
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

const refreshTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return next(new AppError("No refresh token", 401));

    const user = await User.findOne({ refreshToken });
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

        user.refreshToken = newRefreshToken;
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

const signOutHandler = async (
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

const getUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const authUser = (req as any).authUser;

    if (!id) return next(new AppError("User ID is required", 400));
    if (!isValidObjectId(id)) return next(new AppError("Invalid User ID", 400));

    if (id !== authUser._id.toString() && authUser.role !== "admin")
      return next(new AppError("Forbidden access", 403));

    const user = await User.findById(id)
      .select("-password -otp -otpExpiry -refreshToken -__v")
      .lean();
    if (!user) return next(new AppError("User not found", 404));

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserHandler = async (
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

    const { name, email, password } = req.body;
    if (!name && !email && !password)
      return next(new AppError("Name or email or password is required", 400));

    const isEmailTaken = await User.findOne({ email, _id: { $ne: id } });
    if (isEmailTaken) return next(new AppError("Email is already taken", 409));

    const updateData: any = { name, email };
    if (password) {
      updateData.password = await hashPassword(password);
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      select: "-password -otp -otpExpiry -refreshToken -__v",
    }).lean();

    if (!user) return next(new AppError("User not found", 404));

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

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
  refreshTokenHandler,
};

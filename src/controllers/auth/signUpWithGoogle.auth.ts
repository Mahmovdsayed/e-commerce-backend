import { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { AppError } from "../../utils/AppError.js";
import User from "../../DB/Models/user.model.js";
import jwt from "jsonwebtoken";
import sendEmailService from "../../utils/email.js";
import { hashToken } from "../../helpers/hashToken.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signUpGoogleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { credential } = req.body;
    if (!credential) return next(new AppError("Credential is required", 400));

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload)
      return next(new AppError("Invalid Google token payload", 400));

    const { email, name, picture } = payload;
    if (!email || !name)
      return next(new AppError("Email and name are required", 400));

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        avatar: picture,
        provider: "google",
        isVerified: true,
        role: "customer",
      });
    } else {
      if (user.provider !== "google") {
        return next(
          new AppError(
            `Email is already registered with ${user.provider}. Please use that method to sign in.`,
            400
          )
        );
      }
      user.name = name;
      user.avatar = picture;
    }

    if (!process.env.LOGIN_SIG || !process.env.REFRESH_SIG) {
      throw new Error("JWT secrets are missing from environment variables");
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.LOGIN_SIG,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SIG, {
      expiresIn: "30d",
    });

    user.refreshToken = hashToken(refreshToken);
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      accessToken,
    });

    sendEmailService({
      to: email,
      subject: "New Sign-In Notification",
      message: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; font-size: 14px;">
          <h2 style="margin-bottom: 10px;">Hello, ${name}!</h2>
          <p>We noticed a new sign-in to your account using <strong>Google</strong>.</p>
          <p>If this was you, no further action is needed. If you did not sign in, please secure your account immediately.</p>
        </div>
      `,
    }).catch((err) => console.error("Email send failed:", err));
  } catch (error) {
    next(error);
  }
};

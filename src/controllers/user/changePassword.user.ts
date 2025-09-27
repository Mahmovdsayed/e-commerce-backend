import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import User from "../../DB/Models/user.model.js";
import { hashPassword, verifyPassword } from "../../helpers/hashPassword.js";
import sendEmailService from "../../utils/email.js";

export const changePasswordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { oldPassword, newPassword } = req.body;
    const authUser = (req as any).authUser;

    if (!oldPassword || !newPassword)
      return next(new AppError("Old and new passwords are required", 400));

    const user = await User.findById(authUser._id);
    if (!user) return next(new AppError("User not found", 404));

    const isOldPasswordValid = await verifyPassword(oldPassword, user.password);
    if (!isOldPasswordValid)
      return next(new AppError("Old password is incorrect", 400));

    if (oldPassword === newPassword)
      return next(
        new AppError(
          "New password must be different from the old password",
          400
        )
      );

    user.password = await hashPassword(newPassword);
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
    sendEmailService({
      to: user.email,
      subject: "Password Change Notification",
      message: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; font-size: 14px;">
      <h2 style="margin-bottom: 10px;">Hello, ${user.name}!</h2>
      <p>This is a confirmation that your password has been successfully changed.</p>
      <p>If you did not make this change, please contact our support team immediately.</p>
      
      <br/>
      <p>Best regards,</p>
      <p><strong>NEST STUDIO TEAM</strong></p>
      <hr style="margin: 20px 0;" />
      <div style="font-size: 12px; color: #555;"></div>
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

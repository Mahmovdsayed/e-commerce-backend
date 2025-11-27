import { NextFunction, Request, Response } from "express";
import AuthRequest from "../../types/AuthRequest.types.js";
import userModel from "../../DB/Models/user.model.js";

export const deleteUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const authUser = (req as AuthRequest).authUser;

    if (authUser.role !== "admin") {
      return next(new Error("Not authorized"));
    }

    if (!id) {
      return next(new Error("No id provided"));
    }

    const deletedUser = await userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return next(new Error("User not found"));
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

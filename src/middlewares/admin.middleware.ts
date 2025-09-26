// admin auth middleware
import { Request, Response, NextFunction } from "express";

export const adminAuth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authUser = (req as any).authUser;
      if (!authUser) {
        const error = new Error("unauthorized access");
        (error as any).status = 401;
        return next(error);
      }

      if (authUser.role !== "admin") {
        const error = new Error("forbidden access");
        (error as any).status = 403;
        return next(error);
      }

      next();
    } catch (error) {
      const err =
        error instanceof Error
          ? error
          : new Error("catch error in admin auth middleware");
      (err as any).status = 500;
      next(err);
    }
  };
};

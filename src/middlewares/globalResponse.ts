import { Request, Response, NextFunction } from "express";

interface ErrorWithStatus extends Error {
  status?: number;
  details?: any;
}

export const globalResponse = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500;

  const response: any = {
    success: false,
    error: {
      status: statusCode,
      message: err.message || "Internal server error",
    },
  };

  if (err.details) {
    response.error.details = err.details;
  }

  if (process.env.NODE_ENV === "development") {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

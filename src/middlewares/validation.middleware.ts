import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema, ZodIssue } from "zod";

const reqKeys = ["body", "params", "query", "headers"] as const;
type ReqKey = (typeof reqKeys)[number];

type Schema = Partial<Record<ReqKey, ZodSchema>>;

export const validationMiddleware = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    for (const key of reqKeys) {
      const validator = schema[key];
      if (validator) {
        try {
          validator.parse(req[key]);
        } catch (err) {
          if (err instanceof ZodError) {
            err.issues.forEach((e: ZodIssue) => {
              const path = e.path.length > 0 ? e.path.join(".") : key;
              errors.push(`${path} - ${e.message}`);
            });
          } else {
            errors.push("Unknown validation error");
          }
        }
      }
    }

    if (errors.length > 0) {
      res
        .status(400)
        .json({ success: false, message: "validation error", errors });
      return;
    }

    next();
  };
};

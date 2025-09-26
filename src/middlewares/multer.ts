import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import allowedExtensions from "../utils/allowedExtensions.js";

interface MulterMiddlewareOptions {
  extensions?: string[];
  filePath?: string;
}

export const multerMiddleWareLocal = ({
  extensions = allowedExtensions.image,
}: Pick<MulterMiddlewareOptions, "extensions">) => {
  const storage = multer.memoryStorage();

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const ext = file.mimetype.split("/")[1];
    if (extensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Image format is not allowed!"));
    }
  };

  return multer({ storage, fileFilter });
};

export const multerMiddleWareHost = ({
  extensions = allowedExtensions.image,
}: Pick<MulterMiddlewareOptions, "extensions">) => {
  const storage = multer.diskStorage({});

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const ext = file.mimetype.split("/")[1];
    if (extensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Image format is not allowed!"));
    }
  };

  return multer({ storage, fileFilter });
};

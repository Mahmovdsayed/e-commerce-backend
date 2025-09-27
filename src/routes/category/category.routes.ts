import { Router } from "express";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import expressAsyncHandler from "express-async-handler";
import { addCategoryHandler } from "../../controllers/category/addCategory.category.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { adminAuth } from "../../middlewares/admin.middleware.js";
import { addCategorySchema } from "../../validation/category/category.validation.js";
import { multerMiddleWareLocal } from "../../middlewares/multer.js";

const router = Router();

router.post(
  "/add",
  auth(),
  adminAuth(),
  multerMiddleWareLocal({}).single("image"),
  validationMiddleware({ body: addCategorySchema }),
  expressAsyncHandler(addCategoryHandler)
);

export default router;

import { Router } from "express";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import expressAsyncHandler from "express-async-handler";
import { addCategoryHandler } from "../../controllers/category/addCategory.category.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { adminAuth } from "../../middlewares/admin.middleware.js";
import { addCategorySchema, updateCategorySchema } from "../../validation/category/category.validation.js";
import { multerMiddleWareLocal } from "../../middlewares/multer.js";
import allowedExtensions from "../../utils/allowedExtensions.js";
import { getAllCategories } from "../../controllers/category/getAllCategories.category.js";
import { getCategoryInfo } from "../../controllers/category/getCategoryInfo.category.js";
import { updateCategory } from "../../controllers/category/updateCategory.category.js";

const router = Router();

router.post(
  "/add",
  auth(),
  adminAuth(),
  multerMiddleWareLocal({ extensions: allowedExtensions.image }).single(
    "image"
  ),
  validationMiddleware({ body: addCategorySchema }),
  expressAsyncHandler(addCategoryHandler)
);

router.get("/all", expressAsyncHandler(getAllCategories));
router.get("/:id", expressAsyncHandler(getCategoryInfo));
router.patch(
  "/edit/:id",
  auth(),
  adminAuth(),
  multerMiddleWareLocal({ extensions: allowedExtensions.image }).single(
    "image"
  ),
  validationMiddleware({ body: updateCategorySchema }),
  expressAsyncHandler(updateCategory)
);

export default router;

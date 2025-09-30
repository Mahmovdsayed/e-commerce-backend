import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { adminAuth } from "../../middlewares/admin.middleware.js";
import { addProduct } from "../../controllers/product/addProduct.product.js";
import expressAsyncHandler from "express-async-handler";
import { multerMiddleWareLocal } from "../../middlewares/multer.js";
import allowedExtensions from "../../utils/allowedExtensions.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { addProductSchema } from "../../validation/product/product.validation.js";
import { updateProductHandler } from "../../controllers/product/updateProduct.product.js";
import { getProductInfo } from "../../controllers/product/getProductInfo.product.js";
import { cacheMiddleware } from "../../middlewares/cache.middleware.js";
import { getAllProducts } from "../../controllers/product/getAllProducts.product.js";

const router = Router();

router.post(
  "/add",
  auth(),
  adminAuth(),
  multerMiddleWareLocal({ extensions: allowedExtensions.image }).array(
    "images"
  ),
  validationMiddleware({ body: addProductSchema }),
  expressAsyncHandler(addProduct)
);

router.patch(
  "/edit/:id",

  auth(),
  adminAuth(),
  validationMiddleware({ body: addProductSchema }),
  expressAsyncHandler(updateProductHandler)
);

router.get(
  "/info/:id",
  cacheMiddleware("product", 120),
  expressAsyncHandler(getProductInfo)
);

router.get(
  "/all",
  cacheMiddleware("products:all", 120),
  expressAsyncHandler(getAllProducts)
);

export default router;

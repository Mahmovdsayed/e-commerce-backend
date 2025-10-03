import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { createDiscount } from "../../controllers/discount/createDiscount.discount.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { adminAuth } from "../../middlewares/admin.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { createDiscountSchema } from "../../validation/discount/discount.validation.js";
import { getDiscounts } from "../../controllers/discount/getDiscounts.discount.js";
import { cacheMiddleware } from "../../middlewares/cache.middleware.js";
import { updateDiscount } from "../../controllers/discount/updateDiscount.discount.js";
import { deleteDiscount } from "../../controllers/discount/deleteDiscount.discount.js";
import { applyDiscountHandler } from "../../controllers/discount/applyDiscount.discount.js";

const router = Router();

router.post(
  "/create",
  auth(),
  adminAuth(),
  validationMiddleware({ body: createDiscountSchema }),
  expressAsyncHandler(createDiscount)
);

router.get(
  "/all",
  cacheMiddleware("discount", 120),
  auth(),
  adminAuth(),
  expressAsyncHandler(getDiscounts)
);

router.patch(
  "/edit/:discountId",
  auth(),
  adminAuth(),
  validationMiddleware({ body: createDiscountSchema }),
  expressAsyncHandler(updateDiscount)
);

router.delete(
  "/delete/:discountId",
  auth(),
  adminAuth(),
  expressAsyncHandler(deleteDiscount)
);

router.post(
  "/apply-discount",
  auth(),
  validationMiddleware({ body: createDiscountSchema.pick({ code: true }) }),
  expressAsyncHandler(applyDiscountHandler)
);

export default router;

import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { adminAuth } from "../../middlewares/admin.middleware.js";
import expressAsyncHandler from "express-async-handler";
import { addCouponHandler } from "../../controllers/coupon/addCoupon.coupon.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import {
  addCouponSchema,
  applyCouponSchema,
} from "../../validation/coupon/coupon.validation.js";
import { applyCoupon } from "../../controllers/coupon/applyCoupon.coupon.js";

const router = Router();

router.post(
  "/add",
  auth(),
  adminAuth(),
  validationMiddleware({ body: addCouponSchema }),
  expressAsyncHandler(addCouponHandler)
);

router.post(
  "/apply",
  auth(),
  validationMiddleware({ body: applyCouponSchema }),
  expressAsyncHandler(applyCoupon)
);

export default router;

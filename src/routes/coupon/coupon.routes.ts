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
import { applyCoupons } from "../../controllers/coupon/applyCoupon.coupon.js";
import { deleteCouponHandler } from "../../controllers/coupon/deleteCoupon.coupon.js";
import { updateCouponHandler } from "../../controllers/coupon/updateCoupon.coupon.js";

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
  expressAsyncHandler(applyCoupons)
);

router.delete(
  "/delete/:couponId",
  auth(),
  adminAuth(),
  expressAsyncHandler(deleteCouponHandler)
);

router.patch(
  "/edit/:couponId",
  auth(),
  adminAuth(),
  validationMiddleware({ body: addCouponSchema }),
  expressAsyncHandler(updateCouponHandler)
);

export default router;

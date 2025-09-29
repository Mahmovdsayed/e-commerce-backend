import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { adminAuth } from "../../middlewares/admin.middleware.js";
import expressAsyncHandler from "express-async-handler";
import { addCouponHandler } from "../../controllers/coupon/addCoupon.coupon.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { addCouponSchema } from "../../validation/coupon/coupon.validation.js";

const router = Router();

router.post(
  "/add",
  auth(),
  adminAuth(),
  validationMiddleware({ body: addCouponSchema }),
  expressAsyncHandler(addCouponHandler)
);

export default router;

import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { generateDescription } from "../../controllers/product/generateDescription.product.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { adminAuth } from "../../middlewares/admin.middleware.js";
import { generateSeoHandler } from "../../controllers/product/generateSEO.product.js";
import { MarketingPlan } from "../../controllers/product/marketingPlan.product.js";

const router = Router();

router.post(
  "/generate-description/:productId",
  auth(),
  adminAuth(),
  expressAsyncHandler(generateDescription)
);

router.post(
  "/generate-seo/:productId",
  auth(),
  adminAuth(),
  expressAsyncHandler(generateSeoHandler)
);

router.post(
  "/generate-marketing-plan",
  auth(),
  adminAuth(),
  expressAsyncHandler(MarketingPlan)
);

export default router;

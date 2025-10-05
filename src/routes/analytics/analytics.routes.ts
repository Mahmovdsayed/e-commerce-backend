import { Router } from "express";

const router = Router();

import { overviewAnalytics } from "../../controllers/analytics/overview.analytics.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { adminAuth } from "../../middlewares/admin.middleware.js";
import expressAsyncHandler from "express-async-handler";
import { monthlySales } from "../../controllers/analytics/sales.analytics.js";
import { TopProducts } from "../../controllers/analytics/topProducts.analytics.js";
import { productAnalytics } from "../../controllers/analytics/product.analytics.js";

router.get(
  "/overview",
  auth(),
  adminAuth(),
  expressAsyncHandler(overviewAnalytics)
);

router.get(
  "/sales/monthly",
  auth(),
  adminAuth(),
  expressAsyncHandler(monthlySales)
);

router.get(
  "/top-products",
  auth(),
  adminAuth(),
  expressAsyncHandler(TopProducts)
);

router.get(
  "/product/:productId",
  auth(),
  adminAuth(),
  expressAsyncHandler(productAnalytics)
);

export default router;

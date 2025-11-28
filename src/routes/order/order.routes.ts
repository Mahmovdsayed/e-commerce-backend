import express, { Router } from "express";
import { createCashOrder } from "../../controllers/order/createCashOrder.order.js";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { createCashOrderSchema } from "../../validation/order/order.validation.js";
import { createCheckOutSession } from "../../controllers/order/createCheckoutOrderSession.order.js";
import { adminAuth } from "../../middlewares/admin.middleware.js";
import { getAllOrders } from "../../controllers/order/getAllOrders.order.js";
import { cacheMiddleware } from "../../middlewares/cache.middleware.js";

import { stripeWebhook } from "../../controllers/order/stripeWebhook.order.js";

const router = Router();

router.post(
  "/cash/:cartId",
  auth(),
  validationMiddleware({ body: createCashOrderSchema }),
  expressAsyncHandler(createCashOrder)
);

router.post(
  "/checkout/:cartId",
  auth(),
  validationMiddleware({ body: createCashOrderSchema }),
  expressAsyncHandler(createCheckOutSession)
);

router.post("/webhook", expressAsyncHandler(stripeWebhook));

router.get(
  "/all",
  cacheMiddleware("orders", 120),
  auth(),
  adminAuth(),
  expressAsyncHandler(getAllOrders)
);

export default router;

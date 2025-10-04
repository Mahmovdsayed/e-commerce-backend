import { Router } from "express";
import { createCashOrder } from "../../controllers/order/createCashOrder.order.js";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { createCashOrderSchema } from "../../validation/order/order.validation.js";
import { createCheckOutSession } from "../../controllers/order/createCheckoutOrderSession.order.js";
import { createOrderAfterPayment } from "../../controllers/order/createOrderAfterPayment.order.js";
import { adminAuth } from "../../middlewares/admin.middleware.js";
import { getAllOrders } from "../../controllers/order/getAllOrders.order.js";
import { cacheMiddleware } from "../../middlewares/cache.middleware.js";

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

router.get("/confirm", expressAsyncHandler(createOrderAfterPayment));

router.get(
  "/all",
  cacheMiddleware("orders", 120),
  auth(),
  adminAuth(),
  expressAsyncHandler(getAllOrders)
);

export default router;

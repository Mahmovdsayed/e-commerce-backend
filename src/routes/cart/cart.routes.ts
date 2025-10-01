import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { addToCartHandler } from "../../controllers/cart/addToCart.cart.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { addToCartSchema } from "../../validation/cart/cart.validation.js";
import { getCart } from "../../controllers/cart/getCart.cart.js";
import { cacheMiddleware } from "../../middlewares/cache.middleware.js";
import { updateCartItem } from "../../controllers/cart/updateCart.cart.js";
import { removeCartItem } from "../../controllers/cart/removeCartItem.cart.js";
import { clearCart } from "../../controllers/cart/clearCart.cart.js";

const router = Router();

router.post(
  "/add",
  auth(),
  validationMiddleware({ body: addToCartSchema }),
  expressAsyncHandler(addToCartHandler)
);

router.get(
  "/get",
  cacheMiddleware("cart"),
  auth(),
  expressAsyncHandler(getCart)
);

router.put(
  "/update",
  auth(),
  validationMiddleware({ body: addToCartSchema }),
  expressAsyncHandler(updateCartItem)
);

router.delete(
  "/remove/:productId",
  auth(),
  expressAsyncHandler(removeCartItem)
);

router.delete("/clear", auth(), expressAsyncHandler(clearCart));

export default router;

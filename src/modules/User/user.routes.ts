import { Router } from "express";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import {
  signInValidationSchema,
  signUpValidationSchema,
  updatedUserValidationSchema,
} from "./user.validationSchemas.js";
import expressAsyncHandler from "express-async-handler";
import {
  getUserHandler,
  refreshTokenHandler,
  signInHandler,
  signOutHandler,
  signUpHandler,
  updateUserHandler,
} from "./user.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/signup",
  validationMiddleware({ body: signUpValidationSchema }),
  expressAsyncHandler(signUpHandler)
);

router.post(
  "/signin",
  validationMiddleware({ body: signInValidationSchema }),
  expressAsyncHandler(signInHandler)
);

router.post("/logout", expressAsyncHandler(signOutHandler));
router.post("/refresh-token", expressAsyncHandler(refreshTokenHandler));

router.get("/getUser/:id", auth(), expressAsyncHandler(getUserHandler));

router.put(
  "/updateUser/:id",
  auth(),
  validationMiddleware({ body: updatedUserValidationSchema }),
  expressAsyncHandler(updateUserHandler)
);

export default router;

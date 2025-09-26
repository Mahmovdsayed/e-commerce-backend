import { Router } from "express";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import {
  signInValidationSchema,
  signUpValidationSchema,
} from "./user.validationSchemas.js";
import expressAsyncHandler from "express-async-handler";
import {
  logoutHandler,
  refreshTokenHandler,
  signInHandler,
  signUpHandler,
} from "./user.controller.js";

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

router.post("/logout", expressAsyncHandler(logoutHandler));

router.post("/refresh-token", expressAsyncHandler(refreshTokenHandler));

export default router;

import { Router } from "express";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { signUpValidationSchema } from "./user.validationSchemas.js";
import expressAsyncHandler from "express-async-handler";
import { signUpHandler } from "./user.controller.js";

const router = Router();

router.post(
  "/signup",
  validationMiddleware({ body: signUpValidationSchema }),
  expressAsyncHandler(signUpHandler)
);

export default router;

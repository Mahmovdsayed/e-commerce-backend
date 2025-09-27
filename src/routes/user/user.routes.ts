import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import expressAsyncHandler from "express-async-handler";
import { getUserHandler } from "../../controllers/user/getUserInfo.user.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { updateUserHandler } from "../../controllers/user/updateUserInfo.user.js";
import {
  changePasswordValidationSchema,
  updatedUserValidationSchema,
} from "../../validation/auth.validation.js";
import { changePasswordHandler } from "../../controllers/user/changePassword.user.js";

const router = Router();

router.get("/getUser/:id", auth(), expressAsyncHandler(getUserHandler));
router.put(
  "/updateUser/:id",
  auth(),
  validationMiddleware({ body: updatedUserValidationSchema }),
  expressAsyncHandler(updateUserHandler)
);

router.post(
  "/change-password",
  auth(),
  validationMiddleware({
    body: changePasswordValidationSchema,
  }),
  expressAsyncHandler(changePasswordHandler)
);

export default router;

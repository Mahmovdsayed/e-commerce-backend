import { Router } from "express";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import expressAsyncHandler from "express-async-handler";
import { signUpHandler } from "../../controllers/auth/signup.auth.js";
import {
  forgotPasswordValidationSchema,
  googleCredentialsValidationSchema,
  resetPasswordValidationSchema,
  signInValidationSchema,
  signUpValidationSchema,
  verifyEmailValidationSchema,
} from "../../validation/auth/auth.validation.js";
import { signInHandler } from "../../controllers/auth/signIn.auth.js";
import { refreshTokenHandler } from "../../controllers/auth/refreshToken.auth.js";
import { signOutHandler } from "../../controllers/auth/signOut.auth.js";
import { resetPasswordHandler } from "../../controllers/auth/resetPassword.auth.js";
import { verifyEmailHandler } from "../../controllers/auth/verifyEmail.auth.js";
import { forgotPasswordHandler } from "../../controllers/auth/forgotPassword.auth.js";
import { requestNewOTPHandler } from "../../controllers/auth/resendVerificationEmail.auth.js";
import { signUpGoogleHandler } from "../../controllers/auth/signUpWithGoogle.auth.js";

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

router.post("/refresh-token", expressAsyncHandler(refreshTokenHandler));
router.post("/logout", expressAsyncHandler(signOutHandler));

router.post(
  "/reset-password",
  validationMiddleware({ body: resetPasswordValidationSchema }),
  expressAsyncHandler(resetPasswordHandler)
);

router.post(
  "/verify-email",
  validationMiddleware({ body: verifyEmailValidationSchema }),
  expressAsyncHandler(verifyEmailHandler)
);

router.post(
  "/forgot-password",
  validationMiddleware({
    body: forgotPasswordValidationSchema,
  }),
  expressAsyncHandler(forgotPasswordHandler)
);

router.post(
  "/resend-verification-email",
  validationMiddleware({
    body: verifyEmailValidationSchema.pick({ email: true }),
  }),
  expressAsyncHandler(requestNewOTPHandler)
);

router.post(
  "/google",
  validationMiddleware({ body: googleCredentialsValidationSchema }),
  expressAsyncHandler(signUpGoogleHandler)
);

export default router;

import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { addReview } from "../../controllers/review/addReview.review.js";
import expressAsyncHandler from "express-async-handler";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { addReviewSchema } from "../../validation/review/reviews.validation.js";

const router = Router();

router.post(
  "/add-review/:productId",
  auth(),
  validationMiddleware({ body: addReviewSchema }),
  expressAsyncHandler(addReview)
);

export default router;

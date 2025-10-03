import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { addReview } from "../../controllers/review/addReview.review.js";
import expressAsyncHandler from "express-async-handler";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { addReviewSchema } from "../../validation/review/reviews.validation.js";
import { deleteReview } from "../../controllers/review/deleteReview.review.js";
import { adminAuth } from "../../middlewares/admin.middleware.js";
import { getAllReviews } from "../../controllers/review/getAllReviews.review.js";
import { editReview } from "../../controllers/review/editReview.review.js";
import { cacheMiddleware } from "../../middlewares/cache.middleware.js";

const router = Router();

router.post(
  "/add-review/:productId",
  auth(),
  validationMiddleware({ body: addReviewSchema }),
  expressAsyncHandler(addReview)
);

router.delete("/delete/:id", auth(), expressAsyncHandler(deleteReview));
router.get(
  "/all",
  cacheMiddleware("reviews:all", 120),
  auth(),
  adminAuth(),
  expressAsyncHandler(getAllReviews)
);

router.patch(
  "/edit/:id",
  auth(),
  validationMiddleware({ body: addReviewSchema }),
  expressAsyncHandler(editReview)
);

export default router;

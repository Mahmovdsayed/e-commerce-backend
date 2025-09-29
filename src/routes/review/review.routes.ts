import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { addReview } from "../../controllers/review/addReview.review.js";
import expressAsyncHandler from "express-async-handler";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { addReviewSchema } from "../../validation/review/reviews.validation.js";
import { deleteReview } from "../../controllers/review/deleteReview.review.js";
import { adminAuth } from "../../middlewares/admin.middleware.js";
import { getAllReviews } from "../../controllers/review/getAllReviews.review.js";

const router = Router();

router.post(
  "/add-review/:productId",
  auth(),
  validationMiddleware({ body: addReviewSchema }),
  expressAsyncHandler(addReview)
);

router.delete("/delete/:id", auth(), expressAsyncHandler(deleteReview));
router.get("/all", auth(), adminAuth(), expressAsyncHandler(getAllReviews));

export default router;

import { Router } from "express";
import { refundPayment } from "../../controllers/payment/refundPayment.payment.js";
import { getPaymentById } from "../../controllers/payment/getPaymentById.payment.js";
import { getUserPayments } from "../../controllers/payment/getUserPayments.payment.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { adminAuth } from "../../middlewares/admin.middleware.js";

const router = Router();

router.get("/user/:userId", auth(), getUserPayments);

router.get("/:paymentId", auth(), getPaymentById);

router.post("/refund/:paymentId", auth(), adminAuth(), refundPayment);

export default router;

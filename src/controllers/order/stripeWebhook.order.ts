import { NextFunction, Request, Response } from "express";
import { stripe } from "../../Integrations/stripe.js";
import { AppError } from "../../utils/AppError.js";
import orderModel from "../../DB/Models/order.model.js";
import cartModel from "../../DB/Models/cart.model.js";
import paymentModel from "../../DB/Models/payment.model.js";
import sendEmailService from "../../utils/email.js";
import { adminEmail } from "../../utils/statics.js";
import Stripe from "stripe";

export const stripeWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig) {
      return next(new AppError("Missing stripe signature", 400));
    }

    if (!webhookSecret) {
      return next(new AppError("STRIPE_WEBHOOK_SECRET is not configured", 500));
    }

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      return next(new AppError(`Webhook Error: ${err.message}`, 400));
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Check if payment was successful
      if (session.payment_status !== "paid") {
        console.log("⚠️ Payment not completed for session:", session.id);
        res.status(200).json({ received: true });
        return;
      }

      const cartId = session.client_reference_id;
      if (!cartId) {
        console.error("❌ Cart ID not found in session metadata");
        res.status(200).json({ received: true });
        return;
      }

      const { city, phone, street, postalCode, country, userId }: any =
        session.metadata;

      // Check if order already exists (idempotency)
      const existingOrder = await orderModel.findOne({
        paymentId: session.payment_intent,
      });

      if (existingOrder) {
        console.log(
          "ℹ️ Order already exists for payment:",
          session.payment_intent
        );
        res.status(200).json({ received: true });
        return;
      }

      // Get cart details
      const cart = await cartModel
        .findById(cartId)
        .populate("cartItems.productId");

      if (!cart) {
        console.error("❌ Cart not found:", cartId);
        res.status(200).json({ received: true });
        return;
      }

      if (cart.cartItems.length === 0) {
        console.error("❌ Cart is empty:", cartId);
        res.status(200).json({ received: true });
        return;
      }

      // Prepare order items
      const orderItems = cart.cartItems.map((item: any) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.price,
      }));

      const totalAmount = cart.totalPriceAfterDiscount ?? cart.totalPrice;

      // Create order
      const order = await orderModel.create({
        userId,
        items: orderItems,
        totalAmount,
        paymentStatus: "paid",
        status: "paid",
        paymentType: "card",
        paymentId: session.payment_intent,
        shippingAddress: {
          city,
          phone,
          street,
          postalCode,
          country,
        },
      });

      // Create payment record
      await paymentModel.create({
        orderId: order._id,
        userId,
        provider: "stripe",
        transactionId: session.payment_intent as string,
        amount: totalAmount,
        currency: session.currency?.toUpperCase() || "USD",
        status: "success",
      });

      // Delete cart
      await cartModel.findByIdAndDelete(cartId);

      console.log("✅ Order created successfully:", order._id);

      // Send confirmation emails (async, don't block webhook response)
      sendEmailService({
        to: String(session.customer_details?.email),
        subject: "Order Confirmation",
        message: `
          <h1>Hello,</h1>
          <p>Your order has been confirmed and will be shipped soon.</p>
          <p>Order ID: ${order._id}</p>
          <p>Total Amount: $${order.totalAmount}</p>
        `,
      }).catch((err) =>
        console.error("❌ Failed to send customer email:", err)
      );

      sendEmailService({
        to: adminEmail,
        subject: "New Order Received",
        message: `
          <h1>New Order Received</h1>
          <p>A new order has been placed with card payment.</p>
          <p>Order ID: ${order._id}</p>
          <p>Total Amount: $${order.totalAmount}</p>
        `,
      }).catch((err) => console.error("❌ Failed to send admin email:", err));
    }

    // Return 200 to acknowledge receipt of the event
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    next(error);
  }
};

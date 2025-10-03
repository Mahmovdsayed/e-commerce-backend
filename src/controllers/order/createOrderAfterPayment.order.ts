import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError.js";
import { stripe } from "../../Integrations/stripe.js";
import orderModel from "../../DB/Models/order.model.js";
import cartModel from "../../DB/Models/cart.model.js";
import paymentModel from "../../DB/Models/payment.model.js";
import sendEmailService from "../../utils/email.js";
import { adminEmail } from "../../utils/statics.js";

export const createOrderAfterPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { session_id } = req.query;
    if (!session_id) return next(new AppError("Session ID is required", 400));

    const session = await stripe.checkout.sessions.retrieve(String(session_id));
    if (!session) return next(new AppError("Session not found", 404));

    if (session.payment_status !== "paid")
      return next(new AppError("Payment not completed", 400));

    const cartId = session.client_reference_id;
    if (!cartId) return next(new AppError("Cart ID not found", 400));

    const { city, phone, street, postalCode, country, userId }: any =
      session.metadata;

    const cart = await cartModel
      .findById(cartId)
      .populate("cartItems.productId");
    if (!cart) return next(new AppError("Cart not found", 404));

    if (cart.cartItems.length === 0)
      return next(new AppError("Cart is empty", 400));

    const orderItems = cart.cartItems.map((item: any) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.price,
    }));

    const totalAmount = cart.totalPriceAfterDiscount ?? cart.totalPrice;

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

    await paymentModel.create({
      orderId: order._id,
      userId,
      provider: "stripe",
      transactionId: session.payment_intent as string,
      amount: totalAmount,
      currency: session.currency?.toUpperCase() || "USD",
      status: "success",
    });

    await cartModel.findByIdAndDelete(cartId);

    res.status(201).json({
      success: true,
      message: "Order and Payment recorded successfully",
    });
    await sendEmailService({
      to: String(session.customer_details?.email),
      subject: "Order Confirmation",
      message: `
        <h1>Hello,</h1>
        <p>Your order has been confirmed and will be shipped soon.</p>
        <p>Order ID: ${order._id}</p>
        <p>Total Amount: ${order.totalAmount}</p>
        `,
    });
    await sendEmailService({
      to: adminEmail,
      subject: "New Order Received",
      message: `
        <h1>New Order Received</h1>
        <p>A new order has been placed with card payment.</p>
        <p>Order ID: ${order._id}</p>
        <p>Total Amount: ${order.totalAmount}</p>
        `,
    });
  } catch (error) {
    next(error);
  }
};

import { NextFunction, Request, Response } from "express";
import { stripe } from "../../Integrations/stripe.js";
import { AppError } from "../../utils/AppError.js";
import { isValidObjectId } from "mongoose";
import AuthRequest from "../../types/AuthRequest.types.js";
import cartModel from "../../DB/Models/cart.model.js";
import User from "../../DB/Models/user.model.js";

export const createCheckOutSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { cartId } = req.params;
    if (!cartId) return next(new AppError("Cart ID is required", 400));
    if (!isValidObjectId(cartId))
      return next(new AppError("Invalid cart ID", 400));

    const { shippingAddress } = req.body;

    const authUser = (req as AuthRequest).authUser;
    if (!authUser) return next(new AppError("User not found", 404));

    const user = await User.findById(authUser._id);
    if (!user) return next(new AppError("User not found", 404));

    const cart = await cartModel
      .findById(cartId)
      .populate("cartItems.productId");
    if (!cart) return next(new AppError("Cart not found", 404));

    if (cart.cartItems.length === 0)
      return next(new AppError("Cart is empty", 400));

    const totalAfterDiscount = cart.totalPriceAfterDiscount ?? cart.totalPrice;

    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Cart Checkout",
            description: "All products in your cart with discount applied",
          },
          unit_amount: totalAfterDiscount * 100,
        },
        quantity: 1,
      },
    ];

    let session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${
        process.env.FRONTEND_URL || "http://localhost:3001"
      }/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/`,
      customer_email: user.email,
      payment_method_types: ["card"],
      client_reference_id: cartId,
      metadata: {
        userId: authUser._id.toString(),
        city: shippingAddress.city,
        phone: shippingAddress.phone,
        street: shippingAddress.street,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
    });

    res.status(200).json({
      success: true,
      message: "Checkout session created successfully",
      url: session.url,
    });
  } catch (error) {
    next(error);
  }
};

import { NextFunction, Request, Response } from "express";
import productModel from "../../DB/Models/product.model.js";
import cartModel from "../../DB/Models/cart.model.js";
import orderModel from "../../DB/Models/order.model.js";
import { AppError } from "../../utils/AppError.js";
import { isValidObjectId } from "mongoose";
import AuthRequest from "../../types/AuthRequest.types.js";
import sendEmailService from "../../utils/email.js";
import User from "../../DB/Models/user.model.js";
import { adminEmail } from "../../utils/statics.js";

export const createCashOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { cartId } = req.params;
    if (!cartId) return next(new AppError("Cart ID is required", 400));
    if (!isValidObjectId(cartId))
      return next(new AppError("Invalid cart ID", 400));

    const userId = (req as AuthRequest).authUser?._id;
    const userEmail = await User.findById(userId);
    const { shippingAddress } = req.body;

    const cart = await cartModel.findById(cartId);
    if (!cart) return next(new AppError("Cart not found", 404));
    if (cart.cartItems.length === 0)
      return next(new AppError("Cart is empty", 400));

    const productIds = cart.cartItems.map((i) => i.productId);
    const products = await productModel.find({ _id: { $in: productIds } });

    for (const item of cart.cartItems) {
      const product = products.find(
        (p) => p._id.toString() === item.productId.toString()
      );
      if (!product) {
        return next(
          new AppError(`Product with ID ${item.productId} not found`, 404)
        );
      }
      if (product.stock < item.quantity) {
        return next(
          new AppError(
            `Product "${product.name}" is out of stock or not enough quantity (Available: ${product.stock}, Requested: ${item.quantity})`,
            400
          )
        );
      }
      if (!product.isActive) {
        return next(
          new AppError(`Product "${product.name}" is not active`, 400)
        );
      }
    }

    const cartPrice = cart.totalPriceAfterDiscount || cart.totalPrice;

    const order = await orderModel.create({
      userId,
      items: cart.cartItems,
      totalAmount: cartPrice,
      shippingAddress,
      paymentType: "cash",
      paymentStatus: "unpaid",
      status: "pending",
      shippingStatus: "pending",
      paymentId: null,
    });

    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { stock: -item.quantity, sold: item.quantity } },
      },
    }));
    await productModel.bulkWrite(bulkOption);

    await cartModel.findByIdAndDelete(cartId);

    const detailedItems = order.items.map((item: any) => {
      const product = products.find(
        (p) => p._id.toString() === item.productId.toString()
      );
      return {
        ...item,
        productName: product?.name || "Unknown Product",
        productDescription: product?.description || "",
        productImage: product?.images?.[0]?.url || "",
        price: product?.price || 0,
        quantity: item.quantity,
      };
    });

    const productsHtml = detailedItems
      .map(
        (item) => `
        <div style="display:flex; align-items:center; margin-bottom:20px; border-bottom:1px solid #eee; padding-bottom:15px;">
          <img src="${item.productImage}" alt="${
          item.productName
        }" style="width:100px; height:100px; object-fit:cover; border-radius:8px; margin-right:20px;"/>
          <div style="flex:1;">
            <h3 style="margin:0; font-size:16px; color:#333;">${
              item.productName
            }</h3>
            <p style="margin:5px 0; font-size:13px; color:#777;">${
              item.productDescription || "No description"
            }</p>
            <p style="margin:0; font-size:14px;">Qty: <strong>${
              item.quantity
            }</strong></p>
            <p style="margin:0; font-size:14px;">Price: <strong>$${
              item.price
            }</strong></p>
            <p style="margin:0; font-size:14px;">Subtotal: <strong>$${
              item.price * item.quantity
            }</strong></p>
          </div>
        </div>
      `
      )
      .join("");

    // user email
    await sendEmailService({
      to: userEmail?.email,
      subject: "Order Confirmation",
      message: `
      <div style="font-family:Arial, sans-serif; padding:20px; background:#f7f9fc;">
        <h1 style="text-align:center; color:#2c3e50;">✅ Order Confirmed</h1>
        <p style="text-align:center; font-size:14px; color:#666;">
          Order ID: <strong>${order._id}</strong><br/>
          Total Amount: <strong>$${order.totalAmount}</strong>
        </p>

        <div style="margin:20px 0; background:#fff; padding:20px; border-radius:10px; box-shadow:0 3px 6px rgba(0,0,0,0.1);">
          <h2 style="margin-bottom:10px; color:#2c3e50;">📦 Shipping Address</h2>
          <p style="font-size:14px; line-height:1.5;">
            ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${
        order.shippingAddress.country
      }<br/>
            Postal: ${order.shippingAddress.postalCode || ""}<br/>
            Phone: ${order.shippingAddress.phone || ""}
          </p>
        </div>

        <h2 style="margin:20px 0 10px; color:#2c3e50;">🛒 Your Items</h2>
        <div style="background:#fff; padding:20px; border-radius:10px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
          ${productsHtml}
        </div>

        <div style="margin-top:20px; background:#fff; padding:20px; border-radius:10px; box-shadow:0 3px 6px rgba(0,0,0,0.1);">
          <h2 style="margin-bottom:10px; color:#2c3e50;">💳 Payment</h2>
          <p style="margin:0; font-size:14px;">Type: <strong>${
            order.paymentType
          }</strong></p>
          <p style="margin:0; font-size:14px;">Status: <strong>${
            order.paymentStatus
          }</strong></p>
          <p style="margin:0; font-size:14px;">Order: <strong>${
            order.status
          }</strong></p>
        </div>

        <p style="text-align:center; margin-top:30px; font-size:14px; color:#555;">
          🙏 Thanks for shopping with us!
        </p>
      </div>
      `,
    });

    // admin email
    await sendEmailService({
      to: adminEmail,
      subject: "New Order Received",
      message: `
      <div style="font-family:Arial, sans-serif; padding:20px; background:#f7f9fc;">
        <h1 style="text-align:center; color:#2c3e50;">🎉 New Order Alert</h1>
        <p style="text-align:center; font-size:14px; color:#666;">
          A new order has been placed.
        </p>

        <div style="margin:20px 0; background:#fff; padding:20px; border-radius:10px; box-shadow:0 3px 6px rgba(0,0,0,0.1);">
          <h2 style="margin-bottom:10px; color:#2c3e50;">📝 Order Info</h2>
          <p style="font-size:14px;">
            Order ID: <strong>${order._id}</strong><br/>
            User ID: <strong>${order.userId}</strong><br/>
            Total: <strong>$${order.totalAmount}</strong><br/>
            Payment: <strong>${order.paymentType} - ${
        order.paymentStatus
      }</strong><br/>
            Status: <strong>${order.status}</strong>
          </p>
        </div>

        <div style="margin:20px 0; background:#fff; padding:20px; border-radius:10px; box-shadow:0 3px 6px rgba(0,0,0,0.1);">
          <h2 style="margin-bottom:10px; color:#2c3e50;">📦 Shipping Address</h2>
          <p style="font-size:14px; line-height:1.5;">
            ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${
        order.shippingAddress.country
      }<br/>
            Postal: ${order.shippingAddress.postalCode || ""}<br/>
            Phone: ${order.shippingAddress.phone || ""}
          </p>
        </div>

        <h2 style="margin:20px 0 10px; color:#2c3e50;">🛒 Ordered Items</h2>
        <div style="background:#fff; padding:20px; border-radius:10px; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
          ${productsHtml}
        </div>

        <p style="text-align:center; margin-top:30px; font-size:14px; color:#555;">
          🚀 Please process this order ASAP.
        </p>
      </div>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Cash order created successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

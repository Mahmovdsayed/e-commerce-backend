
import { config } from "dotenv";
config({ path: "./.env.local" });

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import { connectToDatabase } from "./DB/connection.js";
import authRouter from "./routes/auth/auth.routes.js";
import userRouter from "./routes/user/user.routes.js";
import categoryRouter from "./routes/category/category.routes.js";
import reviewRouter from "./routes/review/review.routes.js";
import messageRouter from "./routes/message/message.routes.js";
import productRouter from "./routes/product/product.routes.js";
import cartRouter from "./routes/cart/cart.routes.js";
import discountRouter from "./routes/discount/discount.routes.js";
import orderRouter from "./routes/order/order.routes.js";
import paymentRouter from "./routes/payment/payment.routes.js";
import aiRouter from "./routes/ai/ai.routes.js";
import analyticsRouter from "./routes/analytics/analytics.routes.js";

import { globalResponse } from "./middlewares/globalResponse.js";
import cookieParser from "cookie-parser";
import { cacheMiddleware } from "./middlewares/cache.middleware.js";
import morgan from "morgan";

// ✅ Rate Limiters
import {
  apiRateLimiter,
  authRateLimiter,
} from "./middlewares/authRateLimiter.middleware.js";

const app = express();

// ✅ Global middlewares
app.use(
  cors({
    origin: "*",
    credentials: true,
    exposedHeaders: ["accessToken"],
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ⚠️ IMPORTANT: Stripe webhook needs raw body for signature verification
// This must come BEFORE express.json() middleware
app.use("/order/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  morgan("combined", {
    stream: {
      write: (message) => console.log("Morgan: " + message.trim()),
    },
  })
);

// ✅ Apply rate limiters
app.use("/auth", authRateLimiter); //login/signup
app.use(apiRateLimiter); // Global limiter

// ✅ Routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/category", categoryRouter);
app.use("/review", reviewRouter);
app.use("/message", messageRouter);
app.use("/product", productRouter);
app.use("/discount", discountRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/payment", paymentRouter);
app.use("/ai", aiRouter);
app.use("/analytics", analyticsRouter);

app.get(
  "/",
  cacheMiddleware("home"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json({
        success: true,
        projectName: "E-Commerce API",
        version: "1.0.0",
        description:
          "An e-commerce API built with Node.js, Express, and TypeScript.",
        author: "Mahmoud Sayed",
        email: "mahmoudsayed3576@gmail.com",
        license: "MIT",
      });
    } catch (error) {
      next(error);
    }
  }
);

// ✅ Global error handler (after routes)
app.use(globalResponse);

// ✅ Connect DB and start server
const port = process.env.PORT || 3000;

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

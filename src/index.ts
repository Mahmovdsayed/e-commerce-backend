import express, { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import cors from "cors";

import { connectToDatabase } from "./DB/connection.js";
import authRouter from "./modules/User/user.routes.js";
import { globalResponse } from "./middlewares/globalResponse.js";
import cookieParser from "cookie-parser";

config({ path: "./.env.local" });

const app = express();

// ✅ Global middlewares
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Routes
app.use("/auth", authRouter);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      projectName: "NodeJS Starter",
      version: "1.0.0",
      description: "A starter project for NodeJS",
      author: "Mahmoud Sayed",
      email: "mahmoudsayed3576@gmail.com",
      license: "MIT",
    });
  } catch (error) {
    next(error);
  }
});

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

import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { sendMessage } from "../../controllers/message/sendMessage.message.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import {
  sendMessageSchema,
  sendResponseSchema,
} from "../../validation/message/message.validation.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { adminAuth } from "../../middlewares/admin.middleware.js";
import { sendMessaeResponse } from "../../controllers/message/sendResponse.message.js";
import { deleteMessage } from "../../controllers/message/deleteMessage.message.js";
import { getAllMessagesHandler } from "../../controllers/message/getAllMessages.message.js";
import { getMessageInfo } from "../../controllers/message/getMessageInfo.message.js";
import { cacheMiddleware } from "../../middlewares/cache.middleware.js";

const router = Router();

router.post(
  "/send",
  validationMiddleware({ body: sendMessageSchema }),
  expressAsyncHandler(sendMessage)
);

router.post(
  "/response/:messageId",
  auth(),
  adminAuth(),
  validationMiddleware({ body: sendResponseSchema }),
  expressAsyncHandler(sendMessaeResponse)
);

router.delete(
  "/delete/:messageId",
  auth(),
  adminAuth(),
  expressAsyncHandler(deleteMessage)
);

router.get(
  "/all",
  cacheMiddleware("messages:all", 120),
  auth(),
  adminAuth(),
  expressAsyncHandler(getAllMessagesHandler)
);

router.get(
  "/info/:messageId",
  cacheMiddleware("message", 120),
  auth(),
  adminAuth(),
  expressAsyncHandler(getMessageInfo)
);

export default router;

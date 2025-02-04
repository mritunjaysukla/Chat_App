import { Router } from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, sendMessage);
router.get("/:roomId", authMiddleware, getMessages);

export default router;

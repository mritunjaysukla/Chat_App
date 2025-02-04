import { Router } from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authenticateJWT, sendMessage);
router.get("/:roomId", authenticateJWT, getMessages);

export default router;

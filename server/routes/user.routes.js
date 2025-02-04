import { Router } from "express";
import { getUsers, getUserById } from "../controllers/user.controller.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticateJWT, getUsers);
router.get("/:id", authenticateJWT, getUserById);

export default router;

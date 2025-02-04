import { Router } from "express";
import {
  register,
  login,
  getCurrentUser,
} from "../controllers/auth.controller.js";
import { get } from "http";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", getCurrentUser);
export default router;

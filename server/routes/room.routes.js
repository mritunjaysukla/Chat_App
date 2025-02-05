import express from "express";
import {
  createRoom,
  getRooms,
  inviteUserToRoom,
  acceptInvitation,
  rejectInvitation,
  lockRoom,
  unlockRoom,
} from "../controllers/room.controller.js"; // Import the room controller functions
import { authMiddleware } from "../middleware/auth.middleware.js"; // Import the authMiddleware middleware

const router = express.Router();

// Room Routes
router.post("/", authMiddleware, createRoom); // Create a new room
router.get("/", authMiddleware, getRooms); // Get rooms for the logged-in user

// Room Invitation Routes
router.post("/invite", authMiddleware, inviteUserToRoom); // Invite a user to a room
router.post("/accept-invitation", authMiddleware, acceptInvitation); // Accept an invitation to a room
router.post("/reject-invitation", authMiddleware, rejectInvitation); // Reject an invitation to a room

// Room Lock/Unlock Routes
router.post("/lock", authMiddleware, lockRoom); // Lock a room
router.post("/unlock", authMiddleware, unlockRoom); // Unlock a room

export default router;

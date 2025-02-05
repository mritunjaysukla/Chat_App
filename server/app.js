import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import prisma from "./prisma.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import roomRoutes from "./routes/room.routes.js";
import messageRoutes from "./routes/message.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { initializeSocket } from "./utils/socket.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = createServer(app);

// Configure CORS
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173", // Adjust based on your frontend URL
  credentials: true, // Allow cookies to be sent in cross-origin requests
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// 🔥 Socket.io Logic
io.on("connection", (socket) => {
  console.log(`🟢 User Connected: ${socket.id}`);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on("send_message", async ({ roomId, senderId, message }) => {
    if (!roomId || !senderId || !message) return;

    // Store message in DB (Optional)
    const newMessage = await prisma.message.create({
      data: { roomId, senderId, message },
    });

    // Broadcast message to room
    io.to(roomId).emit("receive_message", newMessage);
  });

  socket.on("disconnect", () => {
    console.log(`🔴 User Disconnected: ${socket.id}`);
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/rooms", authMiddleware, roomRoutes);
app.use("/api/messages", authMiddleware, messageRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

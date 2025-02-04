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

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/rooms", authMiddleware, roomRoutes);
app.use("/api/messages", authMiddleware, messageRoutes);

// Initialize Socket.io
const io = new Server(server, { cors: corsOptions });
initializeSocket(io, prisma);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

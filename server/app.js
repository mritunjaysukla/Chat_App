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
import { authenticateJWT } from "./middleware/auth.middleware.js";
import { initializeSocket } from "./utils/socket.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authenticateJWT, userRoutes);
app.use("/api/rooms", authenticateJWT, roomRoutes);
app.use("/api/messages", authenticateJWT, messageRoutes);

// Add this after your middleware setup
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Initialize Socket.io
initializeSocket(io, prisma);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

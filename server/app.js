const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const http = require("http");
const { initializeSocket } = require("./utils/socket");
const { setupMessageSocket } = require("./socket/messageSocket");
const { setupRoomSocket } = require("./socket/roomSocket");
const { setupUserSocket } = require("./socket/userSocket");

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Set up Socket.IO handlers
setupMessageSocket();
setupRoomSocket();
setupUserSocket();

const createDefaultPublicRoom = async () => {
  const publicRoom = await prisma.room.findUnique({
    where: { name: "Public Chat" },
  });

  if (!publicRoom) {
    await prisma.room.create({
      data: {
        name: "Public Chat",
        description: "Default public chat room",
        type: "Public",
      },
    });
  }
};

createDefaultPublicRoom();

// Routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/rooms", require("./routes/room.routes"));
app.use("/messages", require("./routes/message.routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

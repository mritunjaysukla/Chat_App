const { getIO } = require("../utils/socket");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const setupMessageSocket = () => {
  const io = getIO();

  io.on("connection", (socket) => {
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    socket.on("sendMessage", async ({ roomId, senderId, content }) => {
      const message = await prisma.message.create({
        data: {
          content,
          roomId,
          senderId,
        },
      });

      io.to(roomId).emit("newMessage", message);
    });
  });
};

module.exports = { setupMessageSocket };

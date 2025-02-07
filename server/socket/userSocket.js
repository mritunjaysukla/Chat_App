const { getIO } = require("../utils/socket");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const setupUserSocket = () => {
  const io = getIO();

  io.on("connection", (socket) => {
    socket.on("updateStatus", async ({ userId, status }) => {
      await prisma.user.update({
        where: { id: userId },
        data: { status },
      });

      io.emit("userStatusUpdated", { userId, status });
    });
  });
};

module.exports = { setupUserSocket };

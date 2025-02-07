const { getIO } = require("../utils/socket");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const setupRoomSocket = () => {
  const io = getIO();

  io.on("connection", (socket) => {
    socket.on("inviteToRoom", async ({ roomId, userId }) => {
      const invitation = await prisma.roomInvitation.create({
        data: {
          roomId,
          userId,
          invitationStatus: "PENDING",
        },
      });

      io.to(userId).emit("roomInvitation", invitation);
    });
  });
};

module.exports = { setupRoomSocket };

import { Server } from "socket.io";

export function initializeSocket(io, prisma) {
  io.on("connection", (socket) => {
    console.log(`⚡ User Connected: ${socket.id}`);

    socket.on("join_room", async ({ roomId, userId }) => {
      socket.join(roomId);
      console.log(`User ${userId} joined room ${roomId}`);

      // Mark user as online
      await prisma.user.update({
        where: { id: userId },
        data: { status: "Online" },
      });

      io.to(roomId).emit("user_joined", { userId, roomId });
    });

    socket.on("send_message", async (data) => {
      const { content, roomId, senderId } = data;
      const message = await prisma.message.create({
        data: { content, roomId, senderId },
      });

      io.to(roomId).emit("receive_message", message);
    });

    socket.on("disconnect", async () => {
      console.log(`User Disconnected: ${socket.id}`);
    });
  });
}

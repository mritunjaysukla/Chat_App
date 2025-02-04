import jwt from "jsonwebtoken";
export const initializeSocket = (io, prisma) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) return next(new Error("Authentication error"));

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket) => {
    console.log(`User connected: ${socket.user.username}`);

    // Join user to their rooms
    const rooms = await prisma.participant.findMany({
      where: { userId: socket.user.id },
      select: { roomId: true },
    });

    rooms.forEach(({ roomId }) => {
      socket.join(`room_${roomId}`);
    });

    // Message handling
    socket.on("sendMessage", async ({ roomId, content }) => {
      try {
        const message = await prisma.message.create({
          data: {
            content,
            roomId,
            senderId: socket.user.id,
            status: "Sent",
          },
          include: { sender: true },
        });

        io.to(`room_${roomId}`).emit("newMessage", message);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.username}`);
    });
  });
};

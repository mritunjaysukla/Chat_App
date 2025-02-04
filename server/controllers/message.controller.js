import prisma from "../prisma.js";

export const sendMessage = async (req, res) => {
  const { content, roomId } = req.body;
  const userId = req.userId;

  try {
    const message = await prisma.message.create({
      data: {
        content,
        userId,
        roomId: parseInt(roomId),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessages = async (req, res) => {
  const { roomId } = req.params;

  try {
    const messages = await prisma.message.findMany({
      where: {
        roomId: parseInt(roomId),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

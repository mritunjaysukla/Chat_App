import prisma from "../prisma.js";

export const sendMessage = async (req, res) => {
  const { content, roomId } = req.body;
  const senderId = req.user.id; // Fix: changed from userId to senderId

  if (!content || !roomId) {
    return res.status(400).json({ error: "Content and roomId are required" });
  }

  try {
    const message = await prisma.message.create({
      data: {
        content,
        senderId, // Fix: Corrected field name
        roomId: parseInt(roomId),
      },
      include: {
        sender: {
          // Fix: Changed "user" to "sender" to match schema
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

  if (!roomId || isNaN(parseInt(roomId))) {
    return res.status(400).json({ error: "Invalid roomId" });
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        roomId: parseInt(roomId),
      },
      include: {
        sender: {
          // Fix: Changed "user" to "sender" to match schema
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

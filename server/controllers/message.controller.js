const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const sendMessage = async (req, res) => {
  const { roomId, senderId, content } = req.body;

  try {
    const message = await prisma.message.create({
      data: {
        content,
        roomId,
        senderId,
      },
    });
    res.status(201).json({ message });
  } catch (error) {
    res.status(400).json({ error: "Failed to send message" });
  }
};

module.exports = { sendMessage };

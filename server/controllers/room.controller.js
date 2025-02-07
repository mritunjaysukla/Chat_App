const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createRoom = async (req, res) => {
  const { name, description, creatorId } = req.body;

  try {
    const room = await prisma.room.create({
      data: {
        name,
        description,
        creatorId,
      },
    });
    res.status(201).json({ room });
  } catch (error) {
    res.status(400).json({ error: "Room creation failed" });
  }
};

const joinRoom = async (req, res) => {
  const { roomId, userId } = req.body;

  try {
    const participant = await prisma.participant.create({
      data: {
        userId,
        roomId,
      },
    });
    res.status(201).json({ participant });
  } catch (error) {
    res.status(400).json({ error: "Failed to join room" });
  }
};

module.exports = { createRoom, joinRoom };

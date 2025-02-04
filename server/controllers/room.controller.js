import prisma from "../prisma.js";

export const createRoom = async (req, res) => {
  try {
    const { name, description, type } = req.body;

    // Validate room type
    if (!["Public", "Private", "Direct"].includes(type)) {
      return res.status(400).json({ message: "Invalid room type" });
    }

    const room = await prisma.room.create({
      data: {
        name,
        description,
        type, // Prisma will validate this as an enum
        creatorId: req.user.id,
        participants: {
          create: {
            userId: req.user.id,
            role: "Admin",
          },
        },
      },
      include: {
        participants: true,
      },
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: `Error creating room: ${error.message}` });
  }
};

export const getRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      where: {
        OR: [
          { type: "Public" },
          { participants: { some: { userId: req.user.id } } },
        ],
      },
      include: {
        participants: {
          select: {
            userId: true,
            role: true,
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          select: {
            content: true,
            createdAt: true,
          },
        },
      },
    });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: `Error fetching rooms: ${error.message}` });
  }
};

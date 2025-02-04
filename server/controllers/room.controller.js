import prisma from "../prisma.js";

export const createRoom = async (req, res) => {
  try {
    const { name, description, type } = req.body;

    const room = await prisma.room.create({
      data: {
        name,
        description,
        type,
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
    res.status(500).json({ message: "Error creating room" });
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
        participants: true,
        messages: { take: 1, orderBy: { createdAt: "desc" } },
      },
    });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms" });
  }
};

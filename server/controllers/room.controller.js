import prisma from "../prisma.js";

// Create a new room
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
    res.status(500).json({ message: `Error creating room: ${error.message}` });
  }
};

// Get all rooms (with filter based on user participation)
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

// Invite user to room
export const inviteUserToRoom = async (req, res) => {
  try {
    const { roomId, userId } = req.body;

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { participants: true },
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const existingParticipant = room.participants.find(
      (participant) => participant.userId === userId
    );
    if (existingParticipant) {
      return res.status(400).json({ message: "User is already a participant" });
    }

    const invitation = await prisma.roomInvitation.create({
      data: {
        roomId,
        userId,
        invitationStatus: "PENDING",
      },
    });

    res.status(201).json({ message: "Invitation sent", invitation });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error sending invitation: ${error.message}` });
  }
};

// Accept room invitation
export const acceptInvitation = async (req, res) => {
  const { roomId, userId } = req.body;

  try {
    const invitation = await prisma.roomInvitation.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });

    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    await prisma.roomInvitation.update({
      where: { id: invitation.id },
      data: { invitationStatus: "ACCEPTED" },
    });

    await prisma.participant.create({
      data: { roomId, userId, role: "Member" },
    });

    res.status(200).json({ message: "Invitation accepted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error accepting invitation: ${error.message}` });
  }
};

// Reject room invitation
export const rejectInvitation = async (req, res) => {
  const { roomId, userId } = req.body;

  try {
    const invitation = await prisma.roomInvitation.findUnique({
      where: { roomId_userId: { roomId, userId } },
    });

    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    await prisma.roomInvitation.update({
      where: { id: invitation.id },
      data: { invitationStatus: "REJECTED" },
    });

    res.status(200).json({ message: "Invitation rejected" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error rejecting invitation: ${error.message}` });
  }
};

// Lock room
export const lockRoom = async (req, res) => {
  const { roomId } = req.body;

  try {
    const room = await prisma.room.update({
      where: { id: roomId },
      data: { isLocked: true },
    });

    res.status(200).json({ message: "Room locked", room });
  } catch (error) {
    res.status(500).json({ message: `Error locking room: ${error.message}` });
  }
};

// Unlock room
export const unlockRoom = async (req, res) => {
  const { roomId } = req.body;

  try {
    const room = await prisma.room.update({
      where: { id: roomId },
      data: { isLocked: false },
    });

    res.status(200).json({ message: "Room unlocked", room });
  } catch (error) {
    res.status(500).json({ message: `Error unlocking room: ${error.message}` });
  }
};

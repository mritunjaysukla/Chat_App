import React, { useEffect } from "react";
import socket from "../socket";

const RoomInvitation = ({ userId }) => {
  useEffect(() => {
    socket.on("roomInvitation", (invitation) => {
      alert(`You've been invited to room: ${invitation.roomId}`);
    });

    return () => {
      socket.off("roomInvitation");
    };
  }, [userId]);

  return null;
};

export default RoomInvitation;

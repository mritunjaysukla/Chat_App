import React, { useEffect, useState } from "react";
import socket from "../socket";

const UserStatus = ({ userId }) => {
  const [status, setStatus] = useState("Offline");

  useEffect(() => {
    socket.on("userStatusUpdated", ({ userId: updatedUserId, status }) => {
      if (updatedUserId === userId) {
        setStatus(status);
      }
    });

    return () => {
      socket.off("userStatusUpdated");
    };
  }, [userId]);

  return <div>Status: {status}</div>;
};

export default UserStatus;

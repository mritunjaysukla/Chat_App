import React from "react";
import { useNavigate } from "react-router-dom";

const JoinRoom = () => {
  const navigate = useNavigate();

  const joinPublicRoom = () => {
    navigate("/chat/Public Chat"); // Assuming room name is used in the URL
  };

  return (
    <div>
      <button onClick={joinPublicRoom}>Join Public Chat</button>
    </div>
  );
};

export default JoinRoom;

import React from "react";
import { useParams } from "react-router-dom";
import CreateRoom from "../components/Chat/CreateRoom";
import JoinRoom from "../components/JoinRoom";
import ChatRoom from "../components/ChatRoom";
import RoomInvitation from "../components/RoomInvitation";
import UserStatus from "../components/UserStatus";

const ChatPage = () => {
  const { roomId } = useParams();

  return (
    <div className="chat-page">
      <h2>Chat Room: {roomId}</h2>
      <CreateRoom />
      <JoinRoom />
      <RoomInvitation userId={localStorage.getItem("userId")} />
      <UserStatus userId={localStorage.getItem("userId")} />
      <ChatRoom roomId={roomId} />
    </div>
  );
};

export default ChatPage;

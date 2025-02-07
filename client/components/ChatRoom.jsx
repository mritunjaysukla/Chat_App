import React, { useEffect, useState } from "react";
import socket from "../socket";

const ChatRoom = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.emit("joinRoom", roomId);

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [roomId]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit("sendMessage", {
        roomId,
        senderId: localStorage.getItem("userId"),
        content: newMessage,
      });
      setNewMessage("");
    }
  };

  return (
    <div className="chat-room">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <strong>{msg.senderId}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;

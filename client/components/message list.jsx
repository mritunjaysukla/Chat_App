import { useEffect, useState } from "react";
import axios from "axios";
import { useSocket } from "../contexts/SocketContext";

export default function MessageList({ room }) {
  const [messages, setMessages] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!room) return;

    const loadMessages = async () => {
      try {
        const { data } = await axios.get(`/api/messages/${room.id}`, {
          withCredentials: true,
        });
        setMessages(data);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();

    socket?.emit("join-room", room.id);
    socket?.on("new-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket?.off("new-message");
    };
  }, [room, socket]);

  return (
    <div className="message-list">
      {messages.map((message) => (
        <div key={message.id} className="message">
          <div className="message-header">
            <span className="username">{message.sender.username}</span>
            <span className="timestamp">
              {new Date(message.createdAt).toLocaleTimeString()}
            </span>
          </div>
          <div className="message-content">{message.content}</div>
        </div>
      ))}
    </div>
  );
}

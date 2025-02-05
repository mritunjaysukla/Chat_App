import { useEffect, useState } from "react";
import { useSocket } from "../contexts/socket.context"; // Use socket from context
import { useAuth } from "../contexts/auth.context";
import axios from "axios";

const Chat = () => {
  const { user } = useAuth(); // Get logged-in user
  const { socket, isConnected } = useSocket(); // Access socket from context
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receive_message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  const handleJoinRoom = async () => {
    if (!roomId) return;
    socket.emit("join_room", roomId);

    try {
      const { data } = await axios.get(`/api/messages/${roomId}`);
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = { roomId, senderId: user.id, message };
    socket.emit("send_message", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  };

  return (
    <div className="flex flex-col items-center h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">
        Chat App {isConnected ? "🟢" : "🔴"}
      </h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={handleJoinRoom}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Join Room
        </button>
      </div>

      <div className="border p-4 w-96 h-80 overflow-y-auto mb-4">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 my-2 rounded ${
                msg.senderId === user.id
                  ? "bg-blue-200 self-end"
                  : "bg-gray-200 self-start"
              }`}
            >
              <strong>{msg.senderId === user.id ? "You" : "User"}:</strong>{" "}
              {msg.message}
            </div>
          ))
        )}
      </div>

      <div className="flex">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 w-64"
        />
        <button
          onClick={handleSendMessage}
          className="bg-green-500 text-white p-2 ml-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useSocket } from "../contexts/socket.context";
import { useAuth } from "../contexts/auth.context";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

export default function ChatPage() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messageInput, setMessageInput] = useState("");

  // Queries remain the same...

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !roomId) return;

    try {
      socket.emit("send-message", {
        roomId,
        content: messageInput,
      });
      setMessageInput("");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 border-r bg-white">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Chat Rooms</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="p-2 space-y-1">
            {rooms.map((room) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Link
                  to={`/${room.id}`}
                  className={`block w-full px-4 py-2 text-left rounded hover:bg-gray-100 ${
                    roomId === room.id ? "bg-gray-100" : ""
                  }`}
                >
                  #{room.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b bg-white">
          <h1 className="text-xl font-semibold">
            {room ? `#${room.name}` : "Select a room"}
          </h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 items-start"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{message.sender.username}</span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(message.createdAt), "HH:mm")}
                  </span>
                </div>
                <p className="text-gray-800">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              disabled={!roomId}
            />
            <button
              type="submit"
              disabled={!messageInput.trim() || !roomId}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}


import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@shadcn/ui/button";
import { Input } from "@shadcn/ui/input";
import { Card } from "@shadcn/ui/card";
import { ScrollArea } from "@shadcn/ui/scroll-area";
import { useSocket } from "../contexts/SocketContext";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

export default function ChatPage() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messageInput, setMessageInput] = useState("");

  // Fetch room details
  const { data: room } = useQuery({
    queryKey: ["room", roomId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/rooms/${roomId}`, {
        withCredentials: true,
      });
      return data;
    },
    enabled: !!roomId,
  });

  // Fetch messages for the room
  const { data: messages = [] } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/messages/${roomId}`, {
        withCredentials: true,
      });
      return data;
    },
    enabled: !!roomId,
  });

  // Fetch list of available rooms
  const { data: rooms = [] } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const { data } = await axios.get("/api/rooms", {
        withCredentials: true,
      });
      return data;
    },
  });

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
      <Card className="w-80 border-r rounded-none">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Chat Rooms</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="p-2 space-y-1">
            {rooms.map((room) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Button
                  asChild
                  variant={roomId === room.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link to={`/${room.id}`} className="flex items-center gap-2">
                    <span className="truncate">#{room.name}</span>
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white">
          <h1 className="text-xl font-semibold">
            {room ? `#${room.name}` : "Select a room"}
          </h1>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 space-y-4">
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
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              disabled={!roomId}
            />
            <Button type="submit" disabled={!messageInput.trim() || !roomId}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

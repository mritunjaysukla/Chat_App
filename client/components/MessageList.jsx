import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../contexts/socket.context";
import axios from "axios";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { Spinner } from "@shadcn/ui/spinner"; // For loading spinner

export default function MessageList({ room }) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  // Fetch messages using React Query
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", room?.id],
    queryFn: async () => {
      if (!room) return [];
      try {
        const { data } = await axios.get(`/api/rooms/${room.id}/messages`, {
          withCredentials: true,
        });
        return data;
      } catch (error) {
        toast.error("Failed to load messages");
        throw error;
      }
    },
    enabled: !!room,
  });

  // Handle real-time messages
  useEffect(() => {
    if (!socket || !room) return;

    const handleNewMessage = (message) => {
      queryClient.setQueryData(["messages", room.id], (old) => [
        ...(old || []),
        message,
      ]);
    };

    socket.emit("join-room", room.id);
    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [socket, room, queryClient]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {isLoading ? (
        <div className="flex justify-center items-center py-4">
          <Spinner size="lg" />
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No messages yet. Be the first to send one!
        </div>
      ) : (
        messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex gap-3 items-start ${
              message.senderId === room.creatorId
                ? "justify-start"
                : "justify-end"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.senderId === room.creatorId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{message.sender.username}</span>
                <span className="text-sm text-gray-500">
                  {format(new Date(message.createdAt), "HH:mm")}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}

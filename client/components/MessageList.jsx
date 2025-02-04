import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../contexts/socket.context";
import axios from "axios";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export default function MessageList({ room }) {
  const queryClient = useQueryClient();
  const socket = useSocket();

  // Fetch messages using React Query
  const { data: messages = [] } = useQuery({
    queryKey: ["messages", room?.id],
    queryFn: async () => {
      if (!room) return [];
      try {
        const { data } = await axios.get(`/api/messages/${room.id}`, {
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
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
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
  );
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@shadcn/ui/button";
import { Input } from "@shadcn/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@shadcn/ui/card";
import { ScrollArea } from "@shadcn/ui/scroll-area";

export default function RoomList({ onSelectRoom }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  // Fetch rooms using React Query
  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      try {
        const { data } = await axios.get("/api/rooms", {
          withCredentials: true,
        });
        return data;
      } catch (error) {
        toast.error("Failed to load rooms");
        throw error;
      }
    },
  });

  // Create room mutation
  const createRoomMutation = useMutation({
    mutationFn: async (roomName) => {
      const { data } = await axios.post(
        "/api/rooms",
        { name: roomName },
        { withCredentials: true }
      );
      return data;
    },
    onSuccess: (newRoom) => {
      queryClient.setQueryData(["rooms"], (old) => [...(old || []), newRoom]);
      reset();
      toast.success(`Room "${newRoom.name}" created`);
    },
    onError: () => {
      toast.error("Failed to create room");
    },
  });

  const onSubmit = ({ roomName }) => {
    createRoomMutation.mutate(roomName);
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Rooms</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit(onSubmit)} className="px-4 pb-4 border-b">
          <div className="flex gap-2">
            <Input
              {...register("roomName", { required: true })}
              placeholder="New room name"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              Create
            </Button>
          </div>
        </form>

        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="p-2 space-y-1">
            {rooms.map((room) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => onSelectRoom(room)}
                >
                  #{room.name}
                </Button>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

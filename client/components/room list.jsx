import { useEffect, useState } from "react";
import axios from "axios";

export default function RoomList({ onSelectRoom }) {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get("/api/rooms", {
          withCredentials: true,
        });
        setRooms(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  const createRoom = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/rooms",
        {
          name: newRoomName,
        },
        {
          withCredentials: true,
        }
      );
      setRooms([...rooms, data]);
      setNewRoomName("");
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <div className="room-list">
      <h3>Rooms</h3>
      <form onSubmit={createRoom}>
        <input
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="New room name"
        />
        <button type="submit">Create Room</button>
      </form>
      <ul>
        {rooms.map((room) => (
          <li key={room.id} onClick={() => onSelectRoom(room)}>
            {room.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

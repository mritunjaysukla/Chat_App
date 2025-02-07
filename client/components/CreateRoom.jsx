import React, { useState } from "react";
import axios from "axios";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/rooms/create", {
        name: roomName,
        description,
        creatorId: localStorage.getItem("userId"),
      });
      alert(`Room created: ${response.data.room.name}`);
      setRoomName("");
      setDescription("");
    } catch (error) {
      console.error("Failed to create room:", error);
      alert("Failed to create room. Please try again.");
    }
  };

  return (
    <div className="create-room">
      <h3>Create a New Room</h3>
      <form onSubmit={handleCreateRoom}>
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Create Room</button>
      </form>
    </div>
  );
};

export default CreateRoom;

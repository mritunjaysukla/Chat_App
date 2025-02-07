import { SERVER_URL } from "./config";

// Example: Fetch rooms
const fetchRooms = async () => {
  const response = await fetch(`${SERVER_URL}/rooms`);
  const data = await response.json();
  return data;
};
// client/src/config.js
export const SERVER_URL = "http://localhost:5000";

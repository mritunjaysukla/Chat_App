// client/src/socket.js
import { io } from "socket.io-client";
import { SERVER_URL } from "./config"; // Or use process.env.REACT_APP_SERVER_URL

const socket = io(SERVER_URL);

export default socket;

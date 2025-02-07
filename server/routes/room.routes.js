const express = require("express");
const { createRoom, joinRoom } = require("../controllers/room.controller");

const router = express.Router();

// Create a new room
router.post("/create", createRoom);

// Join an existing room
router.post("/join", joinRoom);

module.exports = router;

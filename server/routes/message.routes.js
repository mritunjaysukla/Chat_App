const express = require("express");
const { sendMessage } = require("../controllers/message.controller");

const router = express.Router();

// Send a message in a room
router.post("/send", sendMessage);

module.exports = router;

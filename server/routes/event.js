const express = require("express");
const {getAllEvents, createEvent, getEventsByIds} = require("../controller/eventController");

const router = express.Router();

router.get("/", getAllEvents);
router.post("/create/:userID", createEvent);
router.get("/:userID", getEventsByIds);

module.exports = router;
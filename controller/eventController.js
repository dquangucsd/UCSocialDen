const Event = require("../models/eventModel");

//get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({}); 
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
};





module.exports = getEvents;
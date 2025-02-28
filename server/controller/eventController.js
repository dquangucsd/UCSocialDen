const Event = require("../models/eventModel");
const User = require("../models/userModel");

//get all events
const getAllEvents = async (req, res) => {
  try {
    const allevents = await Event.find({});
    res.status(200).json(allevents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// create an event
const createEvent = async (req, res) => {
  try {
    let newevent = req.body;

    // Convert time strings to Date objects (if they are provided as strings)
    if (typeof newevent.start_time === "string") {
      newevent.start_time = new Date(newevent.start_time);
    }
    if (typeof newevent.end_time === "string") {
      newevent.end_time = new Date(newevent.end_time);
    }

    // get current time as create_time
    newevent['create_time'] = new Date();

    // TODO: Replace the author with real user
    newevent['author'] = "null";

    console.log(newevent);
    const newEvent = await Event.create(newevent);
    res.status(201).json(newEvent);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create an event" });
  }
};

// get events by many IDs (IDs come from the user's joinedEvents)
const getEventsByIds = async (req, res) => {
  try {
    console.log(req.params.userID);
    const user = await User.findById(req.params.userID).populate("joinedEvents")
    // console.log(user);
    console.log(user.joinedEvents);
    // const event = await Event.findById(req.params.id);
    // if (!joined_events) return res.status(404).json({ error: "事件未找到" });
    res.status(200).json(user.joinedEvents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch joined events" });
  }
};

// const getEventById = async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     if (!event) return res.status(404).json({ error: "事件未找到" });
//     res.json(event);
//   } catch (error) {
//     res.status(500).json({ error: "查询事件失败" });
//   }
// };

// const updateEvent = async (req, res) => {
//   try {
//     const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedEvent) return res.status(404).json({ error: "事件未找到" });
//     res.json(updatedEvent);
//   } catch (error) {
//     res.status(500).json({ error: "更新事件失败" });
//   }
// };

// const deleteEvent = async (req, res) => {
//   try {
//     const deletedEvent = await Event.findByIdAndDelete(req.params.id);
//     if (!deletedEvent) return res.status(404).json({ error: "事件未找到" });
//     res.json({ message: "事件删除成功" });
//   } catch (error) {
//     res.status(500).json({ error: "删除事件失败" });
//   }
// };


module.exports = {getAllEvents, createEvent, getEventsByIds};
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const Schema = mongoose.Schema;

const EventSchema = new Schema({
  location: { type: String, required: true },
  name: { type: String, required: true },
  participant_limit: { type: Number, default: 0 },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  tags: [{ type: String, default: [] }],
  author: { type: String, ref: "User", required: true },
  participants: [{ type: String, ref: "User", default: [] }],
  create_time: { type: Date, default: Date.now },
  description: { type: String, default: "" },
  event_image: { type: String, default: "" }
});

EventSchema.plugin(AutoIncrement, { inc_field: "_id" });

module.exports = mongoose.model("Event", EventSchema);
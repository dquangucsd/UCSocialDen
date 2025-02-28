const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: { type: String, required: true }, // email 
  intro: { type: String, default: "" },
  major: { type: String, default: "" },
  name: { type: String, required: true },
  // password: { type: String, required: true },
  password: { type: String, default: "" },
  tag: [{ type: String, default: [] }], 
  number_post: { type: Number, default: 0 }, 
  pid: { type: String, default: "" },
  // pid: { type: String, required: true },
  profile_photo: { type: String, default: "" },
  rating: { type: Number, default: 0 },
  joinedEvents: [{ type: Number, ref: "Event", default: [] }]
}); 

module.exports = mongoose.model("User", UserSchema);
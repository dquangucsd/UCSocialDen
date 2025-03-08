const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: { type: String, required: true }, // email 
  intro: { type: String, default: "" },
  major: { type: String, default: "" },
  name: { type: String, required: true },
  profile_photo: { type: String, default: "" },
  joinedEvents: [{ type: Number, ref: "Event", default: [] }]
}); 

const User = mongoose.model("User", UserSchema);
module.exports = User;
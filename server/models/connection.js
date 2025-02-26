require("dotenv").config();
const mongoose = require("mongoose");

const uri = process.env.MONGO_URI || "";

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};


// setInterval(() => console.log("MongoDB Connection Active..."), 5002);

module.exports = connectDB;
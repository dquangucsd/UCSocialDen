const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://lez022:admin12345@cluster.ntiw1.mongodb.net/210Database";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

// **保持进程运行**
setInterval(() => console.log("MongoDB Connection Active..."), 5000);

module.exports = connectDB;
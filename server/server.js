const express = require("express");
const connectDB = require("./models/connection.js"); 
const passport = require("passport");
const authRoutes = require("./routes/auth.js");

const cors = require("cors");

require("./config/passport")


const PORT = process.env.PORT;
const app = express();
app.use(express.json()); 
app.use(cors());

connectDB(); 

// app.get("/", (req, res) => {
//   res.send("Hello from Express + Mongoose!");
// });
app.use(passport.initialize());

app.use("/auth", authRoutes);

app.use("/api/users", require("./routes/user.js"));
app.use("/api/events", require("./routes/event.js"));

//app.use("/api/users/{email}", require("./routes/userRoutes.js"));
//app.use("/api/events", require("./routes/eventRoutes"));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});










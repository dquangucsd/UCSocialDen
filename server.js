const express = require("express");
const connectDB = require("./config/DB"); 

const app = express();
app.use(express.json()); 

connectDB(); 

app.get("/", (req, res) => {
  res.send("Hello from Express + Mongoose!");
});


app.use("/api/users", require("./routes/userRoutes.js"));
//app.use("/api/events", require("./routes/eventRoutes"));

const PORT = 5002;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));



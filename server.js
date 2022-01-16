require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectDB } = require("./models/index.js");
const { songsRoute, usersRoute } = require("./routes/router.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 1251;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

connectDB().then(() => {
  console.log("connected to DB successfuly");
});

app.use("/songs", songsRoute);
app.use("/users", usersRoute);

//Example
app.get("/app", (req, res) => {
  console.log("by app");
  res.send("by app");
});

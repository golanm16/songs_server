require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectDB, models } = require("./models/index.js");
const { Song, User, Playlist } = models;
const { songsRoute, usersRoute, ytSearchRoute } = require("./routes/router.js");
const jwt = require("jsonwebtoken");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const authJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403); //403 == forbidden
      }
      console.log(user);
      req.user = user;
      next();
    });
  } else {
    console.log("no authHeader");
    return res.sendStatus(401);
  }
};

const port = process.env.PORT || 1251;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

connectDB().then(() => {
  console.log("connected to DB successfuly");
});

app.use("/songs", authJWT, songsRoute);
app.use("/users", usersRoute);
app.use("/ytsearch", ytSearchRoute);

//Example
app.get("/app", (req, res) => {
  console.log("by app");
  res.send("by app");
});

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectDB } = require("./models/index.js");
const {
  songsRoute,
  usersRoute,
  ytSearchRoute,
  playlistRoute,
} = require("./routes/router.js");
const jwt = require("jsonwebtoken");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost/", "http://127.0.0.1/"],
    credentials: true,
  })
);

const authJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403); //403 == forbidden
      }
      console.log(`user authorized: ${user.userName}`);
      req.user = user;
      next();
    });
  } else {
    console.log("no authHeader");
    return res.sendStatus(401);
  }
};

const port = process.env.PORT || 1251;

connectDB().then(() => {
  console.log("connected to DB successfuly");
});

app.use("/songs", authJWT, songsRoute);
app.use("/users", usersRoute);
app.use("/ytsearch", ytSearchRoute);
app.use("/playlist", authJWT, playlistRoute);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

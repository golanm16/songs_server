const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      userName: req.body.userName,
      password: hashedPass,
    });
    const savedUser = await user.save();
    console.log("new user saved");
    res.json(savedUser);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      const accessToken = jwt.sign(
        JSON.stringify(user),
        process.env.TOKEN_SECRET
      );
      res.json(accessToken);
    } else {
      res.status(400).json({ message: "invalid credentials" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "internal server error" });
  }
});

router.get("/", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

module.exports = router;

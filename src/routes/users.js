const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  console.log("got register request");
  const user = await User.findOne({ userName: req.body.userName });
  if (user) {
    res.status(500).json("user already exists");
    return;
  }
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      userName: req.body.userName,
      password: hashedPass,
    });
    const savedUser = await user.save();
    console.log("new user saved");
    savedUser.password = undefined;
    res.json(savedUser);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "internal server error" });
    return;
  }
});

router.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({ userName: req.body.userName });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (match) {
      const accessToken = jwt.sign(
        JSON.stringify(user),
        process.env.TOKEN_SECRET
      );
      res.json(accessToken);
      console.log(`user ${user.userName} logged in`);
      return;
    } else {
      res.status(400).json({ message: "invalid credentials" });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "internal server error" });
    return;
  }
});

router.get("/", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});

module.exports = router;

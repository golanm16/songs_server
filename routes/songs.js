const express = require("express");
const { appendFile } = require("fs");
const router = express.Router();
const Song = require("../models/song.js");

router.get("/songs2", async (req, res) => {
  console.log("songs 2");
  res.send("songs 2");
});
router.post("/", async (req, res) => {
  console.log(req.body);
  let newSong = await new Song({ ...req.body }).save();
  res.send(newSong);
});
router.get("/", async (req, res) => {
  let songsList = await Song.find({});
  res.send(songsList);
});

module.exports = router;

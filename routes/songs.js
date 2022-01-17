const express = require("express");
const { appendFile } = require("fs");
const router = express.Router();
const Song = require("../models/Song.js");

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
router.delete("/:title", async (req, res) => {
  console.log("deleting");
  let song = await Song.findOne({ title: req.params.title });
  console.log(song);
  if (!song) {
    console.log("not song");
    return res.status(400);
  }
  if (req.user.userName === song.user) {
    const deletedSong = await Song.deleteOne(song);
    return res.send(deletedSong);
  }
  console.log("end");
  return res.status(401);
});

module.exports = router;

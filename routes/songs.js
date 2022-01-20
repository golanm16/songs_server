const express = require("express");
const router = express.Router();
const Song = require("../models/Song.js");

router.post("/", async (req, res) => {
  try {
    const song = await Song.findOne({ src: req.body.src });
    if (song) {
      console.log(`song ${song.src} already exists`);
      res.status(500).json({ message: "song already exists" });
      return;
    }
    let newSong = await new Song({
      title: req.body.title,
      artist: req.body.artist,
      src: req.body.src,
      createdBy: req.user._id,
      id: req.body.id,
      provider: req.body.provider,
    }).save();
    res.send(newSong);
  } catch (e) {
    console.log(e);
  }
});
router.get("/", async (req, res) => {
  console.log("getting songs of " + req.user.userName);
  let songsList = await Song.find({ createdBy: req.user._id });
  res.send(songsList);
});
router.delete("/:id", async (req, res) => {
  console.log("deleting");
  let song = await Song.findOne({ id: req.params.id });
  console.log(req.user._id, song.createdBy.toString());
  console.log(song);
  if (!song) {
    console.log("not song");
    return res.status(400);
  }
  if (req.user._id === song.createdBy.toString()) {
    const deletedSong = await Song.deleteOne(song);
    return res.send(deletedSong);
  }
  console.log("end");
  return res.status(401);
});

module.exports = router;

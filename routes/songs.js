const express = require("express");
const { Error } = require("mongoose");
const router = express.Router();
const Song = require("../models/Song.js");

const addSong = async (src, title, artist, provider, userId) => {
  if (!src) {
    throw new Error("song must have source link");
  }
  const song = await Song.findOne({ src });
  return (
    song ||
    (await new Song({
      title,
      artist,
      src,
      createdBy: userId,
      provider,
    }).save())
  );
};

router.post("/", async (req, res) => {
  try {
    const song = await addSong(
      req.body.src,
      req.body.title,
      req.body.artist,
      req.body.provider,
      req.user._id
    );
    res.send(song);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e });
  }
});
router.get("/", async (req, res) => {
  console.log("getting songs of " + req.user.userName);
  let songsList = await Song.find({});
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

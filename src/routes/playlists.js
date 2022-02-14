const express = require("express");
const router = express.Router();
const { Playlist, Song } = require("../models/index.js");

router.post("/create", async (req, res) => {
  try {
    const playlist = await new Playlist({
      name: req.body.name,
      createdBy: req.user._id,
    }).save();
    const savedPlaylist = await playlist.save();
    res.json(savedPlaylist);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "internal server error" });
  }
});

router.post("/addsong", async (req, res) => {
  console.log("adding song to playlist");
  console.log(req.body);
  try {
    let song = await Song.findOne({ src: req.body.songId });
    if (!song) {
      res.status(404).json({ message: "song does not exists" });
      return;
    }
    const playlist = await Playlist.findOne({ _id: req.body.playlistId });
    if (!playlist) {
      res.status(404).json({ message: "playlist does not exists" });
      return;
    }
    if (playlist.songs.includes(song._id)) {
      res
        .status(400)
        .json({ message: `song already exists in playlist ${playlist.name}` });
      return;
    }
    await playlist.songs.push(song._id);
    await playlist.save();
    res.status(200).json(playlist);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "internal server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    console.log(req.user._id);
    const playlists = await Playlist.find({ createdBy: req.user._id });
    res.send(playlists);
  } catch (e) {
    res.status(500).json({ message: "internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id });
    if (!playlist) {
      res.status(404).json({ message: "not found" });
    }
    const songs = await playlist.populate("songs");
    res.status(200).json(songs);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "internal server error" });
  }
});

module.exports = router;

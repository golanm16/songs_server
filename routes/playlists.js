const express = require("express");
const router = express.Router();
const Playlist = require("../models/Playlist.js");
const jwt = require("jsonwebtoken");

router.post("/create", async (req, res) => {
  try {
    const playlist = new Playlist({
      name: req.body.name,
      createdBy: req.user._id,
    });
    const savedPlaylist = await playlist.save();
    res.json(savedPlaylist);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "internal server error" });
  }
});

router.get("/all", async (req, res) => {
  const playlist = await Playlist.find({});
});

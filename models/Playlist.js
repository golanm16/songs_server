const mongoose = require("mongoose");
const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    songs: { type: Array },
    createdBy: { type: mongoose.SchemaTypes.ObjectId },
  },
  { timestamps: true }
);
const Playlist = mongoose.model("Playlist", playlistSchema);
module.exports = Playlist;

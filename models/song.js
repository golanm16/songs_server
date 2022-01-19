const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  src: { type: String, required: true },
  user: { type: String, required: true },
  createdBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
    // required: true,
  },
  provider: { type: String },
});

const Song = mongoose.model("Song", songSchema);
module.exports = Song;

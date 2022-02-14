var mongoose = require("mongoose");
var playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    songs: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Song" }],
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
var Playlist = mongoose.model("Playlist", playlistSchema);
module.exports = Playlist;

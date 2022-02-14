var mongoose = require("mongoose");
var songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    src: { type: String, required: true },
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
    },
    provider: { type: String },
});
var Song = mongoose.model("Song", songSchema);
module.exports = Song;

const mongoose = require("mongoose");
const songSchema = new mongoose.Schema({
  title: { type: string, required: true },
  artist: { type: string, required: true },
  src: { type: string, required: true },
  createdBy: { type: mongoose.SchemaType.ObjectId, ref: "user" },
  provider: { type: string },
});

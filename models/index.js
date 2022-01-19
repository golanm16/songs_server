const mongoose = require("mongoose");
const { Song } = require("./Song.js");
const { User } = require("./User.js");
const { PLaylist } = require("./Playlist.js");

const connectDB = async () => {
  const mongoUrl = process.env.MONGO_URL;
  console.log(mongoUrl);
  return await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
const models = { Song, User, PLaylist };
module.exports = { connectDB, models };

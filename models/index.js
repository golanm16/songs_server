const mongoose = require("mongoose");
const { Song } = require("./song.js");
require("dotenv").config();

const connectDB = async () => {
  const mongoUrl = process.env.MONGO_URL;
  console.log(mongoUrl);
  return await mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
const models = { Song };
module.exports = { connectDB };

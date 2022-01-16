const express = require("express");
const { appendFile } = require("fs");
const router = express.Router();
router.get("/", (req, res) => {
  console.log("songs 1");
  res.send("songs 1");
});
router.get("/getAll", (req, res) => {
  console.log("songs");
  res.send("songs");
});

module.exports = router;

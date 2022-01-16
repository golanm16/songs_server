const express = require("express");
const { appendFile } = require("fs");
const router = express.Router();
router.get("/getAll", (req, res) => {
  console.log("songs");
  express.send("songs");
});

module.exports = router;

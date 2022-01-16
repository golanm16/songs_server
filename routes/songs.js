const express = require("express");
const { appendFile } = require("fs");
const router = express.Router();
router.get("/", (req, res) => {
  console.log("songs 1");
  res.send("songs 1");
});
router.get("/songs2", (req, res) => {
  console.log("songs 2");
  res.send("songs 2");
});
router.post("/", (req, res) => {
  console.log(req.body);
  res.send("arrived");
});

module.exports = router;

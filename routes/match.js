const express = require("express");
const router = express.Router();
const { playMatch, playOff } = require("../controller/matchController");

router.get("/create", playMatch, playOff);

module.exports = router;

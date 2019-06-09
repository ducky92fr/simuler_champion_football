const express = require("express");
const router = express.Router();
const { playMatch } = require("../controller/matchController");

router.get("/create", playMatch);

module.exports = router;

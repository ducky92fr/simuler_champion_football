const express = require("express");
const router = express.Router();
const {
  generateTeam,
  generateLeague
} = require("../controller/teamsController");

router.post("/create", generateTeam, generateLeague);

module.exports = router;

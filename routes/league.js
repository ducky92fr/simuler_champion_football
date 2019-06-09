const express = require("express");
const router = express.Router();
const {
  generateTeam,
  generateLeague
} = require("../controller/leagueController");

router.post("/create", generateTeam, generateLeague);

module.exports = router;

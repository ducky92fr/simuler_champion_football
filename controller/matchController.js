const Classement = require("../models/classement");
const League = require("../models/ligue");

const playMatch = async (req, res, next) => {
  try {
    const match = await League.find({}, "calendrier");
    res.json({ result: match });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { playMatch };

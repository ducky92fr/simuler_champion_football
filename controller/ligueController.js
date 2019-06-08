const Teams = require("../models/teams");
const Ligue = require("../models/ligue");

const ligueGenerate = async (req, res, next) => {
  const { arrayTeam } = req.body;
  res.json({ message: arrayTeam });
};

module.exports = {
  ligueGenerate
};

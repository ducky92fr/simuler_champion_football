const Teams = require("../models/teams");
const League = require("../models/ligue");

const generateTeam = async (req, res, next) => {
  try {
    const { arrayTeam } = req.body;

    //save all teams into teams collection
    await Promise.all(
      arrayTeam.map(el => {
        const team = {
          nom: el
        };
        return Teams.create(team);
      })
    );

    //Create a league
    const numberTeams = arrayTeam.length;
    //calcul number match for each phase aller or retour
    const numberMatchEachPhase = (numberTeams * (numberTeams - 1)) / 2;
    //calcul number match maximum per week
    const numberMatchPerWeek = Math.floor(numberTeams / 2);
    const numberWeekEachPhase = numberMatchEachPhase / numberMatchPerWeek;
    const numberWeekAll = numberWeekEachPhase * 2;
    const calendrier = [];
    const arrayIdTeam = await Teams.find({}, "_id");
    console.log(arrayIdTeam);
    for (let i = 1; i <= numberWeekAll; i++) {
      const week = {
        week: i
      };
      calendrier.push(week);
    }
    const league = {
      teams: arrayIdTeam,
      numberWeeks: numberWeekAll,
      calendrier: calendrier
    };
    await League.create(league);

    res.status(200).json({ message: "League is ready" });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  generateTeam
};

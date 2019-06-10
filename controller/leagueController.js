const Teams = require("../models/teams");
const League = require("../models/ligue");
const Classement = require("../models/classement");

const generateTeam = async (req, res, next) => {
  try {
    const { arrayTeam } = req.body;

    //Await save all teams into teams collection
    let array = await Promise.all(
      arrayTeam.map(nameTeam => {
        const team = {
          nom: nameTeam
        };
        return Teams.create(team);
      })
    );
    //add array team to req for the next middleware
    req.teams = array.map(el => el._id);
    next();
  } catch (err) {
    console.log(err);
  }
};

const generateLeague = async (req, res, next) => {
  try {
    let { teams } = req;
    let teamWithBye = [];
    let teamShuffled = [teams[0]];
    let matrix = [];
    let calendrier = [];

    //Check if number of teams is odd or even, if odd add a dummy team called "Bye"
    teams.length % 2 === 1
      ? (teamWithBye = [...teams, "Bye"])
      : (teamWithBye = [...teams]);

    const nbTeams = teamWithBye.length;
    const midPoint = nbTeams / 2;

    //Calcul for only one phase
    const matchPhase = (nbTeams * (nbTeams - 1)) / 2;
    const matchWeek = Math.floor(nbTeams / 2);
    const roundPhase = matchPhase / matchWeek;

    //This for loop to fixture all match with Round Robin algorithm
    for (let i = 0; i < roundPhase; i++) {
      if (i !== 0) {
        for (let k = 1; k < nbTeams; k++) {
          if (k === 1) {
            teamShuffled[1] = teamWithBye[nbTeams - 1];
          } else {
            teamShuffled[k] = teamWithBye[k - 1];
          }
        }
        teamWithBye = [...teamShuffled];
        matrix[0] = teamShuffled.slice(0, midPoint);
        matrix[1] = teamShuffled.slice(midPoint).reverse();
      } else {
        teamShuffled = [...teamWithBye];
        matrix[0] = teamShuffled.slice(0, midPoint);
        matrix[1] = teamShuffled.slice(midPoint).reverse();
      }

      //Create calendar
      const week = {
        week: i + 1,
        matchs: []
      };
      for (let z = 0; z < midPoint; z++) {
        const match = [matrix[0][z], matrix[1][z]];
        if (!match.includes("Bye")) {
          week.matchs.push(match);
        }
      }
      calendrier.push(week);
    }

    //Create classement for week 0 (week preparation)
    const classement = {
      week: 0,
      scoreBoard: teams.map(el => {
        return { team: el };
      })
    };
    const result = await Classement.create(classement);
    //save ligue to db
    const ligue = {
      teams: teams,
      numberWeeks: roundPhase * 2,
      calendrier: calendrier,
      currentClassement: result._id
    };
    await League.create(ligue);
    res.status(200).json({ message: "League is ready" });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  generateTeam,
  generateLeague
};

const Classement = require("../models/classement");
const League = require("../models/ligue");

function randomGoal(nbButs) {
  const MaxButTeam1 = Math.round(Math.random() * nbButs);
  const MaxButTeam2 = Math.round(Math.random() * nbButs);
  const MinButTeam1 = Math.round(Math.random() * (nbButs - MaxButTeam2));
  const MinButTeam2 = Math.round(Math.random() * (nbButs - MaxButTeam1));
  const butsTeam1 = Math.round((MaxButTeam1 + MinButTeam1) / 2 - 0.1);
  const butsTeam2 = Math.round((MaxButTeam2 + MinButTeam2) / 2 - 0.1);
  return [butsTeam1, butsTeam2];
}

//this is for all matchs aller retour
const playMatch = async (req, res, next) => {
  const nbButs = 7;
  try {
    //Take league's calendar and the currentScoreBoard
    let result = await League.find(
      {},
      "calendrier currentClassement -_id"
    ).populate("currentClassement");

    const calendar = [...result[0].calendrier];
    let currentScoreBoard = [...result[0].currentClassement.scoreBoard];
    let arrayPromise = [];
    //Loop throug all weeks , calendar.length will be number of weeks
    for (let i = 0; i < calendar.length; i++) {
      //All match for that week
      const allMatchs = calendar[i].matchs;

      //Each week has one classement, in the end of each iteration save it to DB
      const classement = {
        week: i + 1,
        matchs: [],
        scoreBoard: []
      };
      //Loop through all matchs in that week given
      for (let k = 0; k < allMatchs.length; k++) {
        let [butsTeam1, butsTeam2] = randomGoal(nbButs);

        //Teams1 is at position 0 in allMatchs[k} array
        //Teams 2 is at position 1 in allMatchs[k} array
        const [team1Id, team2Id] = allMatchs[k];

        //Find index of each team in currentScoreBoard Array
        const indexTeam1 = currentScoreBoard.findIndex(
          el => el.team.toString() == team1Id.toString()
        );
        const indexTeam2 = currentScoreBoard.findIndex(el => {
          return el.team.toString() == team2Id.toString();
        });

        //update scoreBoard that week given (take the last score)
        const scoreTeam1 = currentScoreBoard[indexTeam1];
        const scoreTeam2 = currentScoreBoard[indexTeam2];

        function updateScore(
          scoreBoard,
          result,
          idAdversaire,
          butsOurTeam,
          butsAdversaire
        ) {
          let score = 0;
          if (result === "victoire") score = 3;
          if (result === "defaite") score = 0;
          if (result === "matchNul") score = 1;
          scoreBoard.score += score;
          scoreBoard.numberMatchPlayed += 1;
          scoreBoard[result].push({
            adversaireID: idAdversaire,
            butMarque: butsOurTeam,
            butEncaisse: butsAdversaire
          });
          scoreBoard.butMarque += butsOurTeam;
          scoreBoard.butEncaisse += butsAdversaire;
          scoreBoard.differBut += butsOurTeam - butsAdversaire;
        }

        if (butsTeam1 > butsTeam2) {
          updateScore(scoreTeam1, "victoire", team2Id, butsTeam1, butsTeam2);
          updateScore(scoreTeam2, "defaite", team1Id, butsTeam2, butsTeam1);
        } else if (butsTeam1 < butsTeam2) {
          updateScore(scoreTeam1, "defaite", team2Id, butsTeam1, butsTeam2);
          updateScore(scoreTeam2, "victoire", team1Id, butsTeam2, butsTeam1);
        } else {
          updateScore(scoreTeam1, "matchNul", team2Id, butsTeam1, butsTeam2);
          updateScore(scoreTeam2, "matchNul", team1Id, butsTeam2, butsTeam1);
        }

        // Result Match that week given
        const match = [
          { team: team1Id, but: butsTeam1 },
          { team: team2Id, but: butsTeam2 }
        ];

        classement.matchs.push(match);
      }
      //Arrange all teams in currentScoreBoard before saving it into DB
      //Classement will be based on score, differBut and butMarque
      currentScoreBoard.sort(function(a, b) {
        if (a.score === b.score) {
          if (a.differBut === b.differBut) {
            return b.butMarque - a.butMarque;
          } else {
            return b.differBut - a.differBut;
          }
        } else {
          return b.score - a.score;
        }
      });

      //Using JSON.stringify to deep clone array of object
      classement.scoreBoard = currentScoreBoard.map(el =>
        JSON.parse(JSON.stringify(el))
      );
      arrayPromise.push(Classement.create(classement));
    }

    Promise.all(arrayPromise).then(() => console.log("Done saved all to DB"));

    //Take the 8 first teams are qualified to playoff from last round
    const teamsQualified = currentScoreBoard.slice(0, 8).map(el => el.team);
    req.teams = teamsQualified;
    req.nbWeeks = calendar.length;
    next();
  } catch (err) {
    console.log(err);
  }
};

//This is for playoff
const playOff = async (req, res, next) => {
  try {
    const nbButs = 7;
    const { teams, nbWeeks } = req;

    //quarter final
    //fixture match
    const matchQuarter = [];
    const resultQuarter = [];
    const teamsSemiFinal = [];
    const matchSemiFinal = [];
    const resultSemiFinal = [];
    const teamsFinal = [];
    const matchFinal = [];
    const resultFinal = [];
    let winnerLeague = null;

    for (let i = 0; i < teams.length / 2; i++) {
      matchQuarter[i] = [teams[i], teams[i + 4]];
    }
    //Loop through all matchQuarter in that week given

    for (let i = 0; i < matchQuarter.length; i++) {
      let [butsTeam1, butsTeam2] = randomGoal(nbButs);
      if (butsTeam1 === butsTeam2) {
        randomGoal(nbButs);
      }

      //Teams1 is at position 0 in matchQuarter[i] array
      //Teams 2 is at position 1 in matchQuarter[i] array
      const [team1Id, team2Id] = matchQuarter[i];
      resultQuarter.push([
        { team: team1Id, but: butsTeam1 },
        { team: team2Id, but: butsTeam2 }
      ]);
      const winnerQuarter = butsTeam1 > butsTeam2 ? team1Id : team2Id;
      teamsSemiFinal.push(winnerQuarter);
    }
    const quaterFinal = {
      week: nbWeeks + 1,
      matchs: resultQuarter
    };

    //Semi final
    for (let i = 0; i < teamsSemiFinal.length / 2; i++) {
      matchSemiFinal[i] = [teamsSemiFinal[i], teamsSemiFinal[i + 2]];
    }

    for (let i = 0; i < matchSemiFinal.length; i++) {
      let [butsTeam1, butsTeam2] = randomGoal(nbButs);
      if (butsTeam1 === butsTeam2) {
        randomGoal(nbButs);
      }
      //Teams1 is at position 0 in matchQuarter[i] array
      //Teams 2 is at position 1 in matchQuarter[i] array
      const [team1Id, team2Id] = matchSemiFinal[i];

      resultSemiFinal.push([
        { team: team1Id, but: butsTeam1 },
        { team: team2Id, but: butsTeam2 }
      ]);

      const winnerSemi = butsTeam1 > butsTeam2 ? team1Id : team2Id;
      teamsFinal.push(winnerSemi);
    }
    const semiFinal = {
      week: nbWeeks + 2,
      matchs: resultSemiFinal
    };

    //Final

    for (let i = 0; i < teamsFinal.length / 2; i++) {
      matchFinal[i] = [teamsFinal[i], teamsFinal[i + 1]];
    }

    for (let i = 0; i < matchFinal.length; i++) {
      let [butsTeam1, butsTeam2] = randomGoal(nbButs);
      if (butsTeam1 === butsTeam2) {
        randomGoal(nbButs);
      }

      //Teams1 is at position 0 in matchQuarter[i] array
      //Teams 2 is at position 1 in matchQuarter[i] array
      const [team1Id, team2Id] = matchFinal[i];
      resultFinal.push([
        { team: team1Id, but: butsTeam1 },
        { team: team2Id, but: butsTeam2 }
      ]);
      winnerLeague = butsTeam1 > butsTeam2 ? team1Id : team2Id;
    }

    const final = {
      week: nbWeeks + 3,
      matchs: resultFinal,
      winner: winnerLeague
    };

    await Promise.all([
      Classement.create(quaterFinal),
      Classement.create(semiFinal),
      Classement.create(final)
    ]);
    console.log(nbWeeks);

    const league = await Classement.find({ week: nbWeeks }, "-_id -__v")
      .populate([
        { path: "winner", model: "Team", select: "nom _id" },
        { path: "matchs.team", model: "Team", select: "nom _id" },
        {
          path: "scoreBoard.matchNul.adversaireID",
          model: "Team",
          select: "nom _id"
        },
        {
          path: "scoreBoard.victoire.adversaireID",
          model: "Team",
          select: "nom _id"
        },
        {
          path: "scoreBoard.defaite.adversaireID",
          model: "Team",
          select: "nom _id"
        },
        {
          path: "scoreBoard.team",
          model: "Team",
          select: "nom _id"
        }
      ])
      .exec();

    res.json({ message: "League Done", result: league });
  } catch (err) {
    console.log(err);
  }
};
module.exports = { playMatch, playOff };

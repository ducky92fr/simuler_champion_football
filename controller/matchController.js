const Classement = require("../models/classement");
const League = require("../models/ligue");

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
        const MaxButTeam1 = Math.round(Math.random() * nbButs);
        const MaxButTeam2 = Math.round(Math.random() * nbButs);
        const MinButTeam1 = Math.round(Math.random() * (nbButs - MaxButTeam2));
        const MinButTeam2 = Math.round(Math.random() * (nbButs - MaxButTeam1));
        let butsTeam1 = Math.round((MaxButTeam1 + MinButTeam1) / 2 - 0.1);
        let butsTeam2 = Math.round((MaxButTeam2 + MinButTeam2) / 2 - 0.1);

        //Teams1 is at position 0 in allMatchs[k} array
        //Teams 2 is at position 1 in allMatchs[k} array
        const team1Id = allMatchs[k][0];
        const team2Id = allMatchs[k][1];
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
        // console.log(currentScoreBoard);
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
    const allWeeks = await Promise.all(arrayPromise);
    console.log(allWeeks);
    res.json({ message: "League ended" });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { playMatch };

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
    //Loop throug all weeks
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

        // Result Match that week given
        const match = [
          { team: team1Id, but: butsTeam1 },
          { team: team2Id, but: butsTeam2 }
        ];
        classement.matchs.push(match);

        //update scoreBoard that week given (take the last score)
        const scoreBoardTeam1 = { ...currentScoreBoard[indexTeam1] };
        const scoreBoardTeam2 = { ...currentScoreBoard[indexTeam2] };
        if (butsTeam1 > butsTeam2) {
          currentScoreBoard[indexTeam1] = {
            team: team1Id,
            score: scoreBoardTeam1score + 3,
            numberMatchPlayed: scoreBoardTeam1.numberMatchPlayed + 1,
            matchNul: [...scoreBoardTeam1.matchNul],
            victoire: [
              ...scoreBoardTeam1.victoire,
              {
                adversaireID: team2Id,
                butMarque: butsTeam1,
                butEncaisse: team1Id
              }
            ],
            defaite: [...scoreBoardTeam1.defaite],
            butMarque: scoreBoardTeam1.butMarque + butsTeam1,
            butEncaisse: scoreBoardTeam1.butEncaisse + butsTeam2,
            differBut: scoreBoardTeam1.differBut + butsTeam1 - butsTeam2
          };
        }
      }
      arrayPromise.push(Classement.create(classement));
    }
    await Promise.all(arrayPromise);
    res.json({ result: result });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { playMatch };

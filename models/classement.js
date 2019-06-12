const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classementSchema = new Schema({
  week: {
    type: Number,
    required: true
  },
  matchs: [
    [
      {
        _id: false,
        team: {
          type: Schema.Types.ObjectId,
          ref: "Team"
        },
        but: {
          type: Number
        }
      }
    ]
  ],
  scoreBoard: [
    {
      _id: false,
      team: {
        type: Schema.Types.ObjectId,
        ref: "Team"
      },
      score: {
        type: Number,
        required: true,
        default: 0
      },
      numberMatchPlayed: {
        type: Number,
        required: true,
        default: 0
      },
      matchNul: {
        _id: false,
        number: {
          type: Number,
          default: 0,
          required: true
        },
        matchs: [
          {
            _id: false,
            adversaireID: {
              type: Schema.Types.ObjectId,
              ref: "Team"
            },
            butMarque: {
              type: Number,
              default: 0
            },
            butEncaisse: {
              type: Number,
              default: 0
            }
          }
        ]
      },
      victoire: {
        _id: false,
        number: {
          type: Number,
          default: 0,
          required: true
        },
        matchs: [
          {
            _id: false,
            adversaireID: {
              type: Schema.Types.ObjectId,
              ref: "Team"
            },
            butMarque: {
              type: Number,
              default: 0
            },
            butEncaisse: {
              type: Number,
              default: 0
            }
          }
        ]
      },
      defaite: {
        _id: false,
        number: {
          type: Number,
          default: 0,
          required: true
        },
        matchs: [
          {
            _id: false,
            adversaireID: {
              type: Schema.Types.ObjectId,
              ref: "Team"
            },
            butMarque: {
              type: Number,
              default: 0
            },
            butEncaisse: {
              type: Number,
              default: 0
            }
          }
        ]
      },
      butMarque: {
        type: Number,
        required: true,
        default: 0
      },
      butEncaisse: {
        type: Number,
        required: true,
        default: 0
      },
      differBut: {
        type: Number,
        required: true,
        default: 0
      }
    }
  ],
  winner: {
    type: Schema.Types.ObjectId,
    ref: "Team"
  }
});

module.exports = mongoose.model("Classement", classementSchema);

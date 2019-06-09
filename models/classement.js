const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classementSchema = new Schema({
  week: {
    type: Number
  },
  matchs: [
    [
      {
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
  classement: [
    {
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
      victoire: [
        {
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
      ],
      defaite: [
        {
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
      ],
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
      differnceBut: {
        type: Number,
        required: true,
        default: 0
      }
    }
  ]
});

module.exports = mongoose.model("Classement", classementSchema);

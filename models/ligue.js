const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ligueSchema = new Schema({
  teams: [
    {
      type: Schema.Types.ObjectId,
      required: true
    }
  ],
  numberWeeks: {
    type: Number,
    required: true
  },
  calendrier: [
    {
      _id: false,
      week: {
        type: Number,
        require: true
      },
      matchs: [
        [
          {
            type: Schema.Types.ObjectId
          }
        ]
      ]
    }
  ]
});

module.exports = mongoose.model("Ligue", ligueSchema);

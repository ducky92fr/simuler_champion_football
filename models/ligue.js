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
      week: {
        _id: false,
        type: Number,
        require: true
      }
      // matchs:[{
      //  idTeam1: Schema.Types.ObjectId,
      //  idTeam2: Schema.Types.ObjectId
      // }]
      // classement:[{
      //   type:Schema.Types.ObjectId,
      //   position:{
      //     type:Number,
      //     required:Number
      //   }
      // }]
    }
  ]
});

module.exports = mongoose.model("Ligue", ligueSchema);

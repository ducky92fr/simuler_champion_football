const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamSchema = new Schema({
  nom: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Team", teamSchema);

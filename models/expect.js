const mongoose = require("mongoose");

Expections = new mongoose.Schema({
  userid: {
    type: String,
    require: true,

  },
  matchid: {
    type: String,
    require:true,

  },
  finished:{
    type:Boolean,
    default:false,
  },

  tame_a: {
    type: Number,
  },
  tame_b: {
    type: Number,
  },
});

module.exports = mongoose.model("Expections", Expections);

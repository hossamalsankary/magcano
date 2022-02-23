const mongoose = require('mongoose')

const GameWeek = new mongoose.Schema(
  {
    id: {
      type: Number,
    },
    name: {
      type: String,
    
    },
    finished:{type:Boolean},

  highest_score:{
    type:Number
  },
  
 
  },
)

module.exports = mongoose.model('GameWeek', GameWeek)

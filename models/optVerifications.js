const mongoose = require('mongoose');
const verifications = new mongoose.Schema({
    userid:{
        type:String,
        required: [true, 'Please provide usere ID'], 
    },
    opt:{
        type:Number,
        required: [true, 'Please provide Opt'],    }
});

module.exports = mongoose.model("verifications", verifications);

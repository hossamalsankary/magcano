const mongoose = require('mongoose');

const Matchs = new mongoose.Schema({
    finished:{
        type:Boolean
    },
    started:{
        type:Boolean
    },
    kickoff_time :{
        type:String,
    
    },
    name_and_result: {
        type:Map,
        
    },

    gameweek : {type:Number},

    expectations:{
        type:Object,
        default:[],
        require:[true, 'Please provide name']

    },
    subscribers:{
        type:Array,
        default:[]

    }

},{
    timestamps: true
})

module.exports = mongoose.model('Matchs',Matchs);

const teams = {
    Arsenal: 1,
    Aston_Villa: 2,
    Brentford: 3,
    Brighton: 4,
    Burnley: 5,
    Chelsea: 6,
    Crystal_Palace: 7,
    Everton: 8,
    Leicester: 9,
    Leeds: 10,
    Liverpool: 11,
    Man_City: 12,
    Man_Utd: 13,
    Newcastle: 14,
    Norwich: 15,
    Southampton: 16,
    Spurs: 17,
    Watford: 18,
    West_Ham: 19,
    Wolves: 20
}

const getTeamName = (id)=>{


for (const key in teams) {
    if(id == teams[key]){
       return String(key);
    }
}
}
module.exports = getTeamName;
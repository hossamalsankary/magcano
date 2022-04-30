//lets see what oop can do
//define gameweeks class
const getFlagUrl = require("../flag");
const converttimeid = require("../helper/teamid");
class MatchModel {
  constructor({
    finished,
    kickoff_time,
    team_a,
    team_h,
    team_a_score,
    team_h_score,
    started,
    event,
  } ) {
    this.finished = finished ;
      this.kickoff_time = kickoff_time; 
      this.team_a = team_a;
      this.team_h = team_h;
      this.team_a_score = team_a_score;
      this.team_h_score = team_h_score;
      this.event = event;
      this.started = started;
  }

   get toMap() {
     let team_a = converttimeid(this.team_a);
     let team_h = converttimeid(this.team_h);
     console.log(team_a);
 return   {
  started:this.started,
      finished: this.finished,
      kickoff_time: this.kickoff_time,
       gameweek: this.event,
       expectations:{},
      name_and_result: {
        team_a: team_a,
        team_h:team_h,
        team_a_url:getFlagUrl(team_a),
        team_h_url:getFlagUrl(team_h),
        team_a_score: this.team_a_score,
        team_h_score: this.team_h_score,
      },

    } 
  }
};
module.exports = {
  MatchModel,
};

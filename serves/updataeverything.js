/*Updata and Listen For change*/

//Impot Libraries
const cron = require("node-cron");
const request = require("request");

//Import The Custom Modules
const Matchs = require("../models/matchs");
const config = require("../configure/config");
const converttimeid = require("./helper/teamid");
console.time("get");

const updataAsyncData = async () => {
  //decleartions
  let matchdates = [];

  // Looking For Matches Dates
  let dates = await Matchs.find(
    { finished: false },
    { kickoff_time: 1, _id: 0, gameweek: 1 }
  ).sort({
    kickoff_time: 1,
  });

  //Stor All dates
  for (const i in dates) {
    let date = new Date(dates[i].kickoff_time);
    matchdates.push(date);
  }

  cron.schedule("* * * * *", async () => {
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  let date = new Date().getDate();
  let hours = new Date().getHours();

  for (const day in matchdates) {
    let matchyear = matchdates[day].getFullYear();
    let matchmonth = matchdates[day].getMonth() + 1;
    let matchdate = matchdates[day].getDate();
    let matchhours = matchdates[day].getHours();

    if (year == matchyear && month == matchmonth && date == matchdate) {
      console.log("we Have Job Today" , matchdates[day]);

      console.time("count")
      let events = [];
      let handelPromsesReq = [];
      let updataNext = matchdates.slice(Number(day), Number(day) + 3);
      let selectEvent = [Number(day), Number(day) + 1, Number(day) + 2];

      selectEvent.forEach((i) => {
        events.push(dates[i].gameweek);
      });

      events.forEach((eventnumber) => {
        handelPromsesReq.push(
          (function () {
            let url = config.FAPi_URL.match(eventnumber);
            return new Promise((resolve, reject) => {
              request(url, { json: true }, async (err, res, body) => {
                if (err) reject(err);
                resolve(body);
              });
            });
          })()
        );
      });
      
      //Run The Request Async
      let updataDateFromApi = await Promise.all(handelPromsesReq);

      (function () {
        
        let targeMatch = [];
  
        updataDateFromApi.map((eventdata) => {
          eventdata.map((match) => {
            if (match.finished === false) {
              targeMatch.push(match);
            }
          });
        });
  
        targeMatch.forEach(async (item) => {
           await Matchs.findOneAndUpdate(
            {
              kickoff_time: item.kickoff_time,
            },
            {
              started: item.started,
              finished: item.finished,
              $set: {
                name_and_result: {
                  team_a: converttimeid(item.team_a),
                  team_h: converttimeid(item.team_h),
                  team_a_score: item.team_a_score,
                  team_h_score: item.team_h_score,
                },
              },
              streem:true
            },
            (err, doc) => {
              if (err) {
                console.log(`Error: ` + err);
              } else {
                console.log(doc)
              }
            }
          );
        });
        
      }());
      console.timeEnd("count");
      break;
  
    } else {
      console.log("Nothing To Do");
      break;
    }
  }
   });
};
console.timeEnd("get");

module.exports = updataAsyncData;

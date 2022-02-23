//Import Libararies
const axios = require("axios");

//impor custom libaraies
const MatchScahme = require("../models/matchs");
const config = require("../configure/config");
const { MatchModel } = require("./gameweeks/handel_api");
const { connectDB, endconections } = require("../db/connect");

const requestOb = {
  getGameWeeksID: () => {
    return new Promise(async (resolve, reject) => {
      try {
        axios.get(config.FAPi_URL.event).then((res) => {
          resolve(res.data.events);
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  getMatchsRequest: (ListID) => {
    const promRequestList = ListID.map((id) => {
      return new Promise(async (resolve, reject) => {
        try {
          axios.get(config.FAPi_URL.match(id)).then((res) => {
            resolve(res.data);
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    return promRequestList;
  },
};
const handelDB = {
  resetDataBase: () => {
    console.log("run");
    MatchScahme.deleteMany({}, function (err) {
      console.log("collection removed");
    });
  },

  insertMatch: async (matchdata) => {
    console.time("time");
    try {
      connectDB(config.getDBString());
      handelDB.resetDataBase();

      MatchScahme.create(matchdata).then((docs) => {
        console.log("Done Save");
        endconections().then(() => {
          console.log("disconnected");
          console.timeEnd("time");

          process.exit(0);
        });
      });
    } catch (error) {}
  },
};

requestOb.getGameWeeksID().then(async (eventReqData) => {
  let matchesreadyTosave = [];
  let eventIDList = eventReqData.map((gameWeekItem) => {
    return gameWeekItem.id;
  });

  let matchRequestData = await Promise.all(
    requestOb.getMatchsRequest(eventIDList)
  );

  matchRequestData.forEach(async (matchevent) => {
    matchevent.forEach((match) => {
      try {
      } catch (error) {}
      matchesreadyTosave.push(new MatchModel(match).toMap);
    });
  });

  handelDB.insertMatch(matchesreadyTosave);
});

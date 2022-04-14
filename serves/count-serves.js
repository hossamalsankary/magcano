// Import Libraries

//Import Custem Modles
const { connectDB, endconections } = require("../db/connect");
const Matchs = require("../models/matchs");
const User = require("../models/User");
const Expect = require("../models/expect");
const config = require("../configure/config");

const updataUserPoints = async (userID) => {
  //looking for user matches
  let data = await Expect.find({ userid: userID });

  let matches = data.map(async (match) => {
    return new Promise(async (resolve, reject) => {
      try {
        let matchdata = await Matchs.find({
          _id: match.matchid,
          started: true,
          finished: true,
        } ,);
        resolve(matchdata);
      } catch (error) {
        reject(error);
      }
    });
  });

  Promise.all(matches).then((data) => {
    console.log(data);
  });

};

const start = async () => {
  try {
    await connectDB(process.env.DATABASE_URL);
    updataUserPoints("624d7aa0a042b028e81384fb");
  } catch (error) {}
};
start();

//Import Liabraries
const config = require("../configure/config");
const jwt = require("jsonwebtoken");

//Import Custom Modules
const Matchs = require("../models/matchs");
const User = require("../models/User");
const Expect = require("../models/expect");
const { json } = require("express");

const event = async (req, res) => {
  try {
    // Cheak The Token Valid
    var token = req.headers["authorization"];

    token = String(token).slice(7);

    var decoded = jwt.verify(token, config.JWT_SECRET);

    const { userId, name } = decoded;

    //select curennt game week
    let currentmatch = await Matchs.findOne(
      { finished: false },
      { gameweek: 1, _id: 0 }
    );
    const { gameweek } = currentmatch;

    let cuurrentgameweek = await Matchs.find({ gameweek: gameweek });
    res.json(cuurrentgameweek);
  } catch (err) {
    res.send(err);
  }
};

const addexpectations = async (req, res) => {
  // Get Match Id
  const { matchid, tame_a, tame_b } = req.body;

  //Look For Valid Token
  var token = req.headers["authorization"];
  token = String(token).slice(7);

  try {
    // deCode the Token With  The secret
    var decoded = jwt.verify(token, config.JWT_SECRET);

    //Looking For User ID
    const { userId, name } = decoded;

    //Inser User Expetions
    let insertExpections = {
      userid: userId,
      matchid: matchid,
      tame_a: tame_a,
      tame_b: tame_b,
    };

    Expect.insertMany(insertExpections)
      .then(async (expect) => {
        console.log(expect);
        // After Done Inserted Make A relations To user
        let userData = await User.findOneAndUpdate(
          { _id: userId },
          {
            $push: {
              expectations: {
                expectid: expect._id,
              },
            },
          }
        );

        //Make a relations between user and the Match
        let matchData = await Matchs.findOneAndUpdate(
          { _id: matchid },
          {
            $push: {
              subscribers: {
                name: name,
                userid: userId,
                time: new Date().toTimeString(),
              },
            },
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });

    res.json({ status: "done" });
  } catch (err) {
    res.send(err);
  }
};
const streamevent = async (req, res) => {
  let data = await Matchs.find({
    $and: [{ starteds: true }, { finished: false }],
  });
  if (data.length === 0) {
    console.log("we have no match playing right now");
    data = await Matchs.findOne({ finished: false });
    let now = new Date().valueOf();
    let matchdata = new Date(data.kickoff_time).valueOf();
    let dayLeft = (matchdata - now) / 1000 / 60 / 60 / 24;

    console.log(Math.floor(dayLeft));
  }

  res.json({ data });
};

const gameweeks = async (req, res) => {
  let result = new Array();
  data.forEach(async (gameitems) => {
    let id = gameitems.id;
    let event = await Matchs.find({ gameweek: id });
    var arr = [];
    event.forEach((item) => {
      arr.push(item);
    });
    gameitems.matches = arr;
    res.json(res);
  });
};
const updataJob = async (req, res) => {
  res.send("getallevent");
};
const deleteJob = async (req, res) => {
  res.send("getallevent");
};

module.exports = {
  streamevent,
  event,
  gameweeks,
  addexpectations,
};

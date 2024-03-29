//Import Liabraries
const config = require("../configure/config");
const jwt = require("jsonwebtoken");
const StratBulid = require("../serves/bulid_database");

//Import Custom Modules
const Matchs = require("../models/matchs");
const User = require("../models/User");
const Expect = require("../models/expect");
const verifi = require("../models/optVerifications");

const { json } = require("express");
const { HandelRspondes } = require("./succeed/succeed_res");
const {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors/index");
const { StatusCodes } = require("http-status-codes");
const { search } = require("../app");

const HandelApiControler = {
  event: async (req, res, next) => {
    try {
      var token = req.headers.authorization;

      token = String(token).slice(7);

      jwt.verify(token, config.JWT_SECRET);

      let currentmatch = await Matchs.findOne(
        {            started: false,
      },
        { gameweek: 1, _id: 0 }
      );
      console.log(currentmatch);
      const { gameweek } = currentmatch;
      
      if (!currentmatch) throw new BadRequestError("Opps We Missing Some Data");
      let cuurrentgameweek = await Matchs.find({ gameweek: gameweek }).sort({
        kickoff_time: -1,
      });

      // console.log(cuurrentgameweek);
      res.status(StatusCodes.ACCEPTED).json(cuurrentgameweek);
    } catch (err) {
      next(err);
    }
  },
  userExpections: async (req, res, next) => {
    try {
      // Cheak The Token Valid
      var token = req.headers.authorization;

      token = String(token).slice(7);

      var decoded = jwt.verify(token, config.JWT_SECRET);

      const { userId, name } = decoded;

      Expect.find({ userid: userId }).then((userEx) => {
        let exPectionsMatch = userEx.map((exp) => {
          let matchid = exp.matchid;
          if (!userEx) throw new BadRequestError("Opps Token Not Found");

          return new Promise((resolve, reject) => {
            try {
              Matchs.find({ _id: matchid }, { subscribers: 0 }).then(
                (match) => {
                  if (!match) throw new BadRequestError("Opps Token Not Found");

                  resolve(match);
                }
              );
            } catch (error) {
              reject(error);
            }
          });
        });

        Promise.all(exPectionsMatch).then((data) => {
          let userMatchesdata = data;
          let result = [];
          // userMatchesdata.push(userEx);
          let handeldata = [];

          for (let index = 0; index < userMatchesdata.length; index++) {
            let machitem = userMatchesdata[index][0];
            machitem.expectations.push(userEx[index]);
            handeldata.push(machitem);
          }
          res.status(StatusCodes.OK).json(handeldata);
        });
      });
    } catch (err) {
      res.next(err);
    }
  },
  addexpectations: async (req, res, next) => {
    // Get Match Id
    const { matchid, tame_a, tame_b } = req.body;

    let isThere = await Matchs.find({ _id: matchid });
    if (isThere.length == 0) {
      throw new BadRequestError(`I cant Found This Match $`);
    }

    console.log(isThere.length);
    //Look For Valid Token
    var token = req.headers.authorization;
    try {
      if (!token) throw new BadRequestError("Opps Token Not Found");

      token = String(token).slice(7);

      // deCode the Token With  The secret
      var decoded = jwt.verify(token, config.JWT_SECRET);

      //Looking For User ID
      const { userId, name } = decoded;

      //Inser User Expetions
      let insertExpections = {
        userid: userId,
        matchid: matchid,
        finished: false,
        tame_a: tame_a,
        tame_b: tame_b,
      };
      // Check If The User Add This Expect Before
      let isUniq = await Expect.find({
        $and: [{ userid: userId }, { matchid: matchid }],
      });
      isUniq = isUniq.length == 0 ? true : false;
      if (isUniq) {
        Expect.create(insertExpections)
          .then(async (expect) => {
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
            if (!matchData) throw new BadRequestError("we Got Some Problems");

            await Expect.findOneAndUpdate(
              { matchid: matchData._id },
              { finished: matchData.finished }
            );
          })
          .catch((err) => {
            console.log(err);
          });
        let status = new HandelRspondes({
          massage: "Succeded Creater New Expetions",
        });
        res.status(StatusCodes.CREATED).json(status.succedCreateExpections);
      } else {
        // There We Going To Updata The Expections

        let status = new HandelRspondes({
          massage: "UnSucceded Creater New Expetions",
        });
        res
          .status(StatusCodes.BAD_REQUEST)
          .json(status.unsuccedCreateExpections);
      }
    } catch (err) {
      next(err);
    }
  },

  searching: async (req, res, next) => {
    try {
      let result;
      let query = {};
      // looking for query
      if (!req.query) {
        result = await Matchs.find(query);

        res.status(StatusCodes.OK).json({ result });
      } else {
        // extract the search item
        const { gameweek, sort, limit, team } = req.query;

        if (team) {
          // query['name_and_result.team_a'] = team;
          query["$or"] = [
            { "name_and_result.team_a": team },
            { "name_and_result.team_h": team },
          ];
        }

        if (gameweek) {
          query.gameweek = gameweek;
          console.log(query);
        }
        result = Matchs.find(query);

        if (sort) {
          const sortList = sort.split(",");

          // state = Number(state);
          let sortobject = {};

          if (Number(sortList[1])) {
            sortobject[sortList[0]] = Number(sortList[1]);
            console.log(sortobject);
            result = result.sort(sortobject);
          }
        }
        if (limit) {
          if (Number(limit)) {
            result = result.limit(Number(limit));
          }
        }

        result = await result;

        res.status(StatusCodes.OK).json({ len: result.length, result: result });
      }
    } catch (err) {
      next(err);
    }
  },
};

const resetdata = async (req, res) => {
  await Expect.deleteMany({});
  await User.deleteMany({});
  await verifi.deleteMany({});
  StratBulid();
  res.status(StatusCodes.ACCEPTED).json({ mssage: "You God To GO" });
};

module.exports = {
  event: HandelApiControler.event,
  resetdata: resetdata,
  addexpectations: HandelApiControler.addexpectations,
  userExpections: HandelApiControler.userExpections,
  searching: HandelApiControler.searching,
};

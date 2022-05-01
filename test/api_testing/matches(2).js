require('dotenv').config({ path: "../../.env" });
const jwt = require('jsonwebtoken');
const chai = require("chai");
const { before } = require("mocha");
const app = require("../../app");
const chaiHttp = require("chai-http");
const { connectDB, endconections } = require("../../db/connect");
const Match = require('../../models/matchs');
const config = require("../../configure/config");
let expect = chai.expect;
chai.use(chaiHttp);


describe("GET ALL GAME WEEK AND MATCHES ", function () {
    let token  ;
    let matchId ;

  before(async () => {
  token =  jwt.sign({ 
  email: "hossamalsankary@gmail.com",
  name: "heyyy",} ,process.env.JWT_SECRET);
  });

  it("get Current Game weeks", function (done) {
    chai
      .request(app)
      .get("/api/v1/magicano")
      .set("authorization",`Bearer ${token}`)
      .then(function (res) {
        matchId = res.body[0]._id;
        expect(res).to.have.status(202);
        expect(res.body).to.be.a("Array");

        done();
      })
      .catch((e) => {
        console.log("==========>",e);
        done(e);
      });
  });
  
  it("Test Make User Expections", function (done) {
    //  console.log(matchId);
  chai
    .request(app)
    .post("/api/v1/magicano/expectations")
    .set("authorization",`Bearer ${token}`)
   .
    send({
        matchid:matchId,
        tame_a :2,
        tame_b: 0
    })
    .then(function (res) {
      expect(res).to.have.status(201);

      done();
    })
    .catch((e) => {
      console.log("==========>",e);
      done(e);
    });
});


it("get Current userExpections weeks", function (done) {
  chai
    .request(app)
    .get("/api/v1/magicano/userExpections")
    .set("authorization",`Bearer ${token}`)
    .then(function (res) {
      expect(res).to.have.status(200);
      expect(res.body).to.be.a("Array");

      done();
    })
    .catch((e) => {
      console.log("==========>",e);
      done(e);
    });
});


  after(async () => {
    chai
    .request(app).delete('/api/v1/magicano/resetdata').then((dtat)=>{

    });
  });
});

require('dotenv').config({ path: "../../.env" });

const chai = require("chai");
const { before } = require("mocha");
const app = require("../../app");
const chaiHttp = require("chai-http");
const { connectDB, endconections } = require("../../db/connect");
const config = require("../../configure/config");
const User = require("../../models/User");
let expect = chai.expect;
chai.use(chaiHttp);

describe("test Auth ", function () {
    let token  = ""
  before(async () => {
     // console.log(process.env.DATABASE_URL)
      await connectDB(process.env.DATABASE_URL);;
   // await connectDB(config.getDBString());
    await User.deleteMany({});
  });

  it("Crate New User", function (done) {
    chai
      .request(app)
      .post("/api/v1/auth/register")
      .send({
        password: "123456789",
        email: "hossamalsankary@gmail.com",
        name: "heyyy",
      })
      .then(function (res) {
        expect(res.body).to.haveOwnProperty("massage");
        expect(res).to.have.status(201);
        done();
      })
      .catch((e) => {
        console.log("==========>",e);
        done(e);
      });
  });
  it("Login", function (done) {
    chai
      .request(app)
      .post("/api/v1/auth/login")
      .set("authorization",'Bearer')
      .send({
        password: "123456789",
        email: "hossamalsankary@gmail.com",
      })
      .then(function (res) {
//console.log(res.body.token);
        token = res.body.token;
        expect(res.body).to.haveOwnProperty("massage");
        expect(res).to.have.status(201);
        done();
      })
      .catch((e) => {
        console.log("==========>",e);
        done(e);
      });
  });
  it("Forget Password", function (done) {
    chai
      .request(app)
      .post("/api/v1/auth/forgetPassword")
      .set("authorization",'Bearer')
      .send({
        email: "hossamalsankary@gmail.com",
      })
      .then(function (res) {
    
        expect(res.body).to.haveOwnProperty("massage");
        expect(res).to.have.status(202);
        done();
      })
      .catch((e) => {
        console.log("==========>",e);
        done(e);
      });
  });
   it("Verifications with code", function (done) {
    chai
      .request(app)
      .post("/api/v1/auth/verifications")
      .set("authorization",`Bearer ${token}`)
      .send({
        email: "hossamalsankary@gmail.com",
        verifiycode:12345
      })
      .then(function (res) {
        
        expect(res.body).to.haveOwnProperty("massage");
        expect(res).to.have.status(202);
        done();
      })
      .catch((e) => {
        console.log("==========>",e);
        done(e);
      });
  });
  it("ResetPassword", function (done) {
    chai
      .request(app)
      .post("/api/v1/auth/resetpassword ")
      .set("authorization",`Bearer ${token}`)
      .send({
        password:"123344444"
   
      })
      .then(function (res) {
        
        expect(res.body).to.haveOwnProperty("massage");
        expect(res).to.have.status(202);
        done();
      })
      .catch((e) => {
        console.log("==========>",e);
        done(e);
      });
  });


  after(async () => {
    await endconections();
  });
});

const chai = require("chai");
const expect = chai.expect;
const should = chai.should;
const app = require("../../app");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
// this test for testing the searching Methonds
describe("Testing Search in ALL Game Weeks", function () {
  before(() => {
    console.log("before testing");
  });

  it("Return All game Weeks In the DateBase", function (done) {
      let token = "";
    // First we have req type get
    chai
      .request(app)
      .get("/api/v1/magicano/searching")
      .set("authorization", `Bearer ${token}`)
      .then((respond) => {

          expect(respond).have.to.status(200);
       
          done();

      }).catch((erorre)=>{
          console.log(erorre);
          done();
      });
  });
  it("Shoud Get Spesific GameWeek", function (done) {
    let token = "";
  // First we have req type get
  chai
    .request(app)
    .get("/api/v1/magicano/searching?gameweek=1&team=Arsenal")
    .set("authorization", `Bearer ${token}`)
    .then((respond) => {

        expect(respond).have.to.status(200);
     
        done();

    }).catch((erorre)=>{
        console.log(erorre);
        done();
    });
});
});

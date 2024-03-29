var app = require("../server.js");
var chai = require("chai");
chai.use(require("chai-http"));
var expect = require("chai").expect;

var agent = require("chai").request.agent(app);

describe("Splitwise App", function () {
  it("GET /getAllUser - Get All User", function (done) {
    agent
      .get("/getAllUser")
      .then(function (res) {
        expect(JSON.parse(res.text).length).to.equal(24);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it("Get /getUserSpecificGetOwsInfo - Detail", function (done) {
    agent
      .get("/getUserSpecificGetOwsInfo?email=tejas@gmail.com")
      .then(function (res) {
        expect(JSON.parse(res.text).length).to.equal(1);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it("GET /getGroupNotification - group notification", function (done) {
    agent
      .get("/getGroupNotification?memberID=divyamittal@gmail.com")
      .then(function (res) {
        expect(JSON.parse(res.text).length).to.equal(0);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
  it("POST /getUserInfo - Update the profile of user", function (done) {
    agent
      .post("/getUserInfo")
      .set("content-type", "application/json")
      .send({ userEmail: "tejas@gmail.com" })
      .then(function (res) {
        expect(JSON.parse(res.text).length).to.equal(0);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });

  it("Get /getGroupMemberName - Group Member Names", function (done) {
    agent
      .get("/getGroupMemberName?groupName=Farewell Party")
      .then(function (res) {
        expect(JSON.parse(res.text).length).to.equal(3);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
});

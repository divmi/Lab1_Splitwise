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
        expect(JSON.parse(res.text).length).to.equal(21);
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
        expect(JSON.parse(res.text).length).to.equal(5);
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
        expect(JSON.parse(res.text).length).to.equal(2);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
  it("POST /updateProfile - Update the profile of user", function (done) {
    agent
      .get("/getUserInfo?userEmail=divyamittal@gmail.com")
      .then(function (res) {
        expect(JSON.parse(res.text).length).to.equal(1);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
  it("Put /getGroupMemberName - Group Member Names", function (done) {
    agent
      .get("/getGroupMemberName?groupName=Group Divya")
      .then(function (res) {
        expect(JSON.parse(res.text).length).to.equal(4);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
});

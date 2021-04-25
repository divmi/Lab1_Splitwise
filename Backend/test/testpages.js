var app = require("../server.js");
var chai = require("chai");
chai.use(require("chai-http"));
var expect = require("chai").expect;

var agent = require("chai").request.agent(app);
const auth =
  "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwODFiYmJhNWJiMDNjNjJlYzAwYzg4MiIsImlhdCI6MTYxOTMyMDI4NywiZXhwIjoxNjIwMzI4Mjg3fQ.2XDTN56AhUl7uYNCS5lQG8dcZZJHtX7R0oY1hN7phgo";

it("POST /loginUser", function (done) {
  agent
    .post("/login/loginUser")
    .send({ username: "divyamittal@gmail.com", password: "abcd" })
    .set("Authorization", auth)
    .then(function (res) {
      expect(res).to.have.status(200);
      done();
    })
    .catch(e => {
      done(e);
    });
});

describe("Splitwise App", function () {
  it("GET transaction/getTransactionInfo - get info", function (done) {
    agent
      .get("transaction/getTransactionInfo?ID=6081bfb742f00d4d8ec7d1b8")
      .set("Authorization", auth)
      .then(function (res) {
        expect(res).to.have.status(200);
        done();
      })
      .catch(e => {
        done(e);
      });
  });

  it("Get /getTransactionFromUser - Detail", function (done) {
    agent
      .get(
        "transaction/getTransactionFromUser?ID=6081bbba5bb03c62ec00c882&page=0&size=2"
      )
      .set("Authorization", auth)
      .then(function (res) {
        expect(res).to.have.status(200);
        done();
      })
      .catch(e => {
        done(e);
      });
  });

  it("GET /getCommentForTransaction - get comment", function (done) {
    agent
      .get("/comment/getCommentForTransaction?transID=6082643ffaab8711dae2c757")
      .set("Authorization", auth)
      .then(function (res) {
        expect(res).to.have.status(200);
        done();
      })
      .catch(e => {
        done(e);
      });
  });

  it("Get /getGroupSummary - Group Member Names", function (done) {
    agent
      .get("/group/getGroupSummary?ID=6081bbba5bb03c62ec00c882")
      .set("Authorization", auth)
      .then(function (res) {
        expect(res).to.have.status(200);
        done();
      })
      .catch(e => {
        done(e);
      });
  });
});

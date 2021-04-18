"use strict";
const express = require("express");
const router = express.Router();
const { auth } = require("../Utils/passport");
var kafka = require("./../kafka/client");
auth();

//Route to handle Post Request Call
router.post("/loginUser", (req, res) => {
  kafka.make_request("loginUser", req.body, function (err, results) {
    if (err) {
      res.status(500).end("Unsuccessfull Login");
    } else {
      var JSONStr = JSON.stringify(results);
      res.status(200).end(JSONStr);
    }
  });
});

router.post("/signupUser", async (req, res) => {
  kafka.make_request("signupUser", req.body, function (err, results) {
    if (err) {
      res.status(500).end("Registered");
    } else {
      var JSONStr = JSON.stringify(results);
      res.status(200).end(JSONStr);
    }
  });
});

module.exports = router;

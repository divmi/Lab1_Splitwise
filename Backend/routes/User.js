"use strict";
const express = require("express");
const router = express.Router();
const { checkAuth } = require("../Utils/passport");
var kafka = require("./../kafka/client");

// app.post("/updateProfile", function (req, res) {
//     var update = new Update.update();
//     update.updateUserProfile(req.body, res);
//   });

router.post("/updateProfile", checkAuth, function (req, res) {
  kafka.make_request("updateProfile", req.body, function (err, results) {
    if (err) {
      res.status(500).end("Error Occured");
    } else {
      var JSONStr = JSON.stringify(results);
      res.status(200).end(JSONStr);
    }
  });
});

router.post("/getAllUser", checkAuth, function (req, res) {
  console.log(req.body);
  kafka.make_request("getAllUser", req.body, function (err, results) {
    if (err) {
      res.status(500).end("Error Occured");
    } else {
      var JSONStr = JSON.stringify(results);
      res.status(200).end(JSONStr);
    }
  });
});

router.get("/getUserSpecificGetOwsInfo", checkAuth, function (req, res) {
  kafka.make_request(
    "getUserSpecificGetOwsInfo",
    req.query.ID,
    function (err, results) {
      if (err) {
        res.status(500).end("Error Occured");
      } else {
        var JSONStr = JSON.stringify(results);
        res.status(200).end(JSONStr);
      }
    }
  );
});

module.exports = router;

"use strict";
const express = require("express");
const router = express.Router();
const { checkAuth } = require("../utils/passport");
var kafka = require("./../kafka/client");

router.post("/settleUp", checkAuth, function (req, res) {
  kafka.make_request("settleUp", req.body, function (err, results) {
    if (err) {
      res.status(500).end("Error Occured");
    } else {
      var JSONStr = JSON.stringify(results);
      res.status(200).end(JSONStr);
    }
  });
});

router.post("/insertGroupTransaction", checkAuth, function (req, res) {
  kafka.make_request(
    "insertGroupTransaction",
    req.body,
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

router.get("/getTransactionInfo", checkAuth, function (req, res) {
  kafka.make_request(
    "getTransactionInfo",
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

router.get("/getTransactionFromUser", checkAuth, function (req, res) {
  kafka.make_request(
    "getTransactionFromUser",
    req.query,
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

// app.get("/getTransactionInfo", function (req, res) {
//   var userDetail = new group.group();
//   userDetail.gettransactionDetail(req.query.ID, res);
// });

// app.get("/getTransactionFromUser", function (req, res) {
//   var userDetail = new group.group();
//   userDetail.getTransactionFromUser(req.query, res);
// });

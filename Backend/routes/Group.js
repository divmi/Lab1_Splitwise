"use strict";
const express = require("express");
const router = express.Router();
const { checkAuth } = require("../Utils/passport");
var kafka = require("./../kafka/client");

router.post("/createGroup", checkAuth, function (req, res) {
  kafka.make_request("createGroup", req.body, function (err, results) {
    if (err) {
      res.status(500).end("Error Occured");
    } else {
      var JSONStr = JSON.stringify(results);
      res.status(200).end(JSONStr);
    }
  });
});

router.post("/updateGroup", checkAuth, function (req, res) {
  kafka.make_request("updateGroup", req.body, function (err, results) {
    if (err) {
      res.status(500).end("Error Occured");
    } else {
      var JSONStr = JSON.stringify(results);
      res.status(200).end(JSONStr);
    }
  });
});

router.post("/joinedGroup", checkAuth, function (req, res) {
  kafka.make_request("joinGroup", req.body, function (err, results) {
    if (err) {
      res.status(500).end("Error Occured");
    } else {
      var JSONStr = JSON.stringify(results);
      res.status(200).end(JSONStr);
    }
  });
});

router.get("/getGroupNotification", checkAuth, function (req, res) {
  kafka.make_request(
    "getGroupNotification",
    req.query.memberID,
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

router.get("/getGroupSummary", checkAuth, function (req, res) {
  kafka.make_request("getGroupSummary", req.query.ID, function (err, results) {
    if (err) {
      res.status(500).end("Error Occured");
    } else {
      var JSONStr = JSON.stringify(results);
      res.status(200).end(JSONStr);
    }
  });
});

router.get("/getCurrentUserGroup/", checkAuth, function (req, res) {
  kafka.make_request(
    "getCurrentUserGroup",
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

// app.get("/getCurrentUserGroup/", function (req, res) {
//   var userDetail = new group.group();
//   userDetail.getGroupDetail(req.query.ID, res);
// });

// app.get("/getGroupSummary", function (req, res) {
//   var tdetail = new transaction.transactionDetail();
//   tdetail.getGroupSummary(req.query.ID, res);
// });

// app.get("/getGroupNotification", function (req, res) {
//   var userDetail = new group.group();
//   userDetail.getGroupNotification(req.query.memberID, res);
// });

// app.post("/joinedGroup", function (req, res) {
//   var trans = new transaction.transactionDetail();
//   trans.groupJoinRequest(req.body, res);
// });

module.exports = router;

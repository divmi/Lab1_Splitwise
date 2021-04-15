"use strict";
const express = require("express");
const router = express.Router();
const { checkAuth } = require("../utils/passport");
const insert = require("./../insert");
var kafka = require("./../kafka/client");

router.post("/createGroup", checkAuth, function (req, res) {
  kafka.make_request("createGroup", req.body, function (err, results) {
    if (err) {
      res.status(500).end("Error Occured");
    } else {
      //console.log("Inside else");
      //console.log(results);
      var JSONStr = JSON.stringify(results);
      res.status(200).end(JSONStr);
    }
  });
  // console.log("Req Body : ", req.body);
  // var insgrp = new insert.insert();
  // insgrp.insert_Group(req.body, res);
});

module.exports = router;

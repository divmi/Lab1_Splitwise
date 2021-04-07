"use strict";
const express = require("express");
const router = express.Router();
const { checkAuth } = require("../utils/passport");
const insert = require("./../insert");

router.post("/createGroup", checkAuth, function (req, res) {
  console.log("Req Body : ", req.body);
  var insgrp = new insert.insert();
  insgrp.insert_Group(req.body, res);
});

module.exports = router;

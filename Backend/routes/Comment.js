"use strict";
const express = require("express");
const router = express.Router();
// const { checkAuth } = require("../Utils/passport");
// var kafka = require("./../kafka/client");

// router.post("/addComment", checkAuth, function (req, res) {
//   kafka.make_request("addComment", req.body, function (err, results) {
//     if (err) {
//       res.status(500).end("Error Occured");
//     } else {
//       var JSONStr = JSON.stringify(results);
//       res.status(200).end(JSONStr);
//     }
//   });
// });

// router.post("/deleteComment", checkAuth, function (req, res) {
//   kafka.make_request("deleteComment", req.body, function (err, results) {
//     if (err) {
//       res.status(500).end("Error Occured");
//     } else {
//       var JSONStr = JSON.stringify(results);
//       res.status(200).end(JSONStr);
//     }
//   });
// });

// router.get("/getCommentForTransaction", checkAuth, function (req, res) {
//   kafka.make_request(
//     "getCommentForTransaction",
//     req.query.transID,
//     function (err, results) {
//       if (err) {
//         res.status(500).end("Error Occured");
//       } else {
//         var JSONStr = JSON.stringify(results);
//         res.status(200).end(JSONStr);
//       }
//     }
//   );
// });

// app.get("/getCommentForTransaction", function (req, res) {
//     var comment = new Comment.comment();
//     comment.getCommentFromTransactionTable(req.query.transID, res);
//   });

module.exports = router;

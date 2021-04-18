const Comment = require("../Model/Comment");

function handle_request(trans_ID, callback) {
  console.log("Inside book kafka backend");
  Comment.find({ Trans_ID: trans_ID })
    .populate("comments.MemberCommented", ["Name"])
    .then(result => {
      callback(null, result);
    });
}

exports.handle_request = handle_request;

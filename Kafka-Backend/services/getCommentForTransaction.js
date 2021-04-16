const Comment = require("../Model/Comment");

function handle_request(body, callback) {
  console.log("Inside book kafka backend");
  console.log(body._id);
  Comment.find({ Trans_ID: trans_ID })
    .populate("comments.MemberCommented", ["Name"])
    .then(result => {
      callback(null, result);
    });
}

exports.handle_request = handle_request;

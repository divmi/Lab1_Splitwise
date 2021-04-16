const Comment = require("../Model/Comment");

function handle_request(body, callback) {
  console.log("Inside book kafka backend");
  Comment.updateOne(
    { Trans_ID: body.transactionID },
    { $pull: { comments: { _id: body.commentID } } },
    (error, result) => {
      if (error) {
        callback(error, "Comment Not Found");
      } else if (result) {
        callback(null, result);
      }
    }
  );
}

exports.handle_request = handle_request;

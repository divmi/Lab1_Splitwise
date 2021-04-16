const Comment = require("../Model/Comment");

function handle_request(body, callback) {
  console.log("Inside book kafka backend");
  Comment.updateOne(
    { Trans_ID: body.transactionID },
    {
      $push: {
        comments: {
          MemberCommented: body.memberCommented,
          Comment: body.comment
        }
      }
    },
    { upsert: true },
    (error, result) => {
      if (error) {
        callback(error, "Comment Not Found");
      } else {
        callback(null, result);
      }
    }
  );
}

exports.handle_request = handle_request;

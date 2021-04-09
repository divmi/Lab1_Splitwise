const Comment = require("./Model/Comment");

class comment {
  insertCommentToTransactionTable(body, res) {
    Comment.updateOne(
      { Trans_ID: body.transactionID },
      {
        $push: {
          comments: {
            MemberCommented: body.memberCommented,
            Comment: body.comment,
          },
        },
      },
      { upsert: true },
      (error, result) => {
        if (error) {
          res.writeHead(500, {
            "Content-Type": "text/plain",
          });
          res.end("Transaction Not Found");
        } else {
          res.writeHead(200, {
            "Content-Type": "text/plain",
          });
          res.end(JSON.stringify(result));
        }
      }
    );
  }

  getCommentFromTransactionTable(trans_ID, res) {
    Comment.find({ Trans_ID: trans_ID })
      .populate("comments.MemberCommented", ["Name"])
      .then((result) => {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end(JSON.stringify(result));
      });
  }

  deleteComment(body, res) {
    Comment.updateOne(
      { Trans_ID: body.transactionID },
      { $pull: { comments: { _id: body.commentID } } },
      (error, result) => {
        if (error) {
          res.writeHead(500, {
            "Content-Type": "text/plain",
          });
          res.end("Comment Not Found");
        } else if (result) {
          res.writeHead(200, {
            "Content-Type": "text/plain",
          });
          res.end(JSON.stringify(result));
        }
      }
    );
  }
}

module.exports = {
  comment,
};

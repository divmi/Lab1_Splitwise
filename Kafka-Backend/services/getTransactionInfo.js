const TransactionDetail = require("../Model/TransactionDetailModel");

function handle_request(ID, callback) {
  console.log("Inside book kafka backend");
  TransactionDetail.find({ GroupID: ID })
    .populate("GroupID", ["GroupName"])
    .populate("MemberID", ["Name"])
    .sort({ Time: "desc" })
    .then(transaction => {
      callback(null, transaction);
      //   res.writeHead(200, {
      //     "Content-Type": "text/plain"
      //   });
      //   res.end(JSON.stringify(transaction));
    });
}

exports.handle_request = handle_request;

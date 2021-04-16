const TransactionDetail = require("../Model/TransactionDetailModel");

async function handle_request(query, callback) {
  console.log("Inside book kafka backend");
  let { page, size, ID } = query;
  let skip = 0;
  if (page == 0) {
    skip = 0;
  } else {
    skip = page * size;
  }
  const limit = parseInt(size);
  const count = await TransactionDetail.count({ MemberID: ID });
  TransactionDetail.find({ MemberID: ID })
    .populate("GroupID", ["GroupName"])
    .populate("MemberID", ["Name"])
    .sort({ Time: "desc" })
    .limit(limit)
    .skip(skip)
    .then(transaction => {
      const data = {
        transactionCount: count,
        transaction: transaction
      };
      //   res.end(JSON.stringify(data));
      callback(null, data);
    });
  console.log("Connected!");
}

exports.handle_request = handle_request;

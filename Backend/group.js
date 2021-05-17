const Users = require("./Model/UserRegistrationModel");
const GroupInfo = require("./Model/GroupInfoModel");
const TransactionDetail = require("./Model/TransactionDetailModel");
var group = class group {
  getAllUser(res) {
    Users.find({}, (error, user) => {
      if (error) {
        res.writeHead(401, {
          "Content-Type": "text/plain"
        });
        res.end("Not able to read users");
      } else if (user) {
        res.writeHead(200, {
          "Content-Type": "text/plain"
        });
        res.end(JSON.stringify(user));
      }
    });
  }
  // To find the ref column
  getGroupDetail(ID) {
    return new Promise(async (resolve, reject) => {
      GroupInfo.find({ "GroupMemberInfo.ID": { $all: ID } })
        .populate("GroupMemberInfo.ID", ["Name", "Email", "UserProfilePic"])
        .then(grp => {
          resolve(grp);
        });
    });
  }

  gettransactionDetail(ID, res) {
    TransactionDetail.find({ GroupID: ID })
      .populate("GroupID", ["GroupName"])
      .populate("MemberID", ["Name"])
      .sort({ Time: "desc" })
      .then(transaction => {
        res.writeHead(200, {
          "Content-Type": "text/plain"
        });
        res.end(JSON.stringify(transaction));
      });
  }

  async getTransactionFromUser(query, res) {
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
        res.writeHead(200, {
          "Content-Type": "text/plain"
        });
        const data = {
          transactionCount: count,
          transaction: transaction
        };
        res.end(JSON.stringify(data));
      });
    console.log("Connected!");
  }
};

module.exports = {
  group
};

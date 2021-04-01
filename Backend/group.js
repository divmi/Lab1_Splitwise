const Users = require("./Model/UserRegistrationModel");
const GroupInfo = require("./Model/GroupInfoModel");
const TransactionDetail = require("./Model/TransactionDetailModel");
var group = class group {
  getAllUser(res) {
    Users.find({}, (error, user) => {
      if (error) {
        res.writeHead(401, {
          "Content-Type": "text/plain",
        });
        res.end("Not able to read users");
      } else if (user) {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end(JSON.stringify(user));
      }
    });
  }
  // To find the ref column
  getGroupDetail(ID, res) {
    GroupInfo.find({ "GroupMemberInfo.ID": { $all: ID } })
      .populate("GroupMemberInfo.ID", ["Name", "Email", "UserProfilePic"])
      .then((grp) => {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end(JSON.stringify(grp));
      });
  }

  gettransactionDetail(ID, res) {
    TransactionDetail.find({ GroupID: ID })
      .populate("GroupID", ["GroupName"])
      .populate("MemberID", ["Name"])
      .sort({ Time: "desc" })
      .then((transaction) => {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end(JSON.stringify(transaction));
      });
  }

  getTransactionFromUser(ID, res) {
    TransactionDetail.find({ MemberID: ID })
      .populate("GroupID", ["GroupName"])
      .populate("MemberID", ["Name"])
      .sort({ Time: "desc" })
      .then((transaction) => {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end(JSON.stringify(transaction));
      });
    console.log("Connected!");
  }
};

module.exports = {
  group,
};

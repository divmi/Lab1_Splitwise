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
    console.log("Control came here :" + ID);
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
    console.log("Connected!");
    TransactionDetail.find({ GroupID: ID })
      .populate("GroupID", ["GroupName"])
      .populate("MemberID", ["Name"])
      .then((transaction) => {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end(JSON.stringify(transaction));
      });
  }

  getTransactionFromUser(ID, res) {
    console.log("Connected!");
    TransactionDetail.find({ MemberID: ID })
      .populate("GroupID", ["GroupName"])
      .populate("MemberID", ["Name"])
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

const GroupInfo = require("../Model/GroupInfoModel");
const TransactionDetail = require("../Model/TransactionDetailModel");

exports.getGroup = async args => {
  return new Promise(async (resolve, reject) => {
    const groupInfo = await GroupInfo.find({
      "GroupMemberInfo.ID": { $all: args }
    }).populate("GroupMemberInfo.ID", ["Name", "Email", "UserProfilePic"]);
    resolve(groupInfo);
  });
};

exports.getDetailTransaction = async args => {
  return new Promise(async (resolve, reject) => {
    TransactionDetail.find({ GroupID: args })
      .populate("GroupID", ["GroupName"])
      .populate("MemberID", ["Name"])
      .sort({ Time: "desc" })
      .then(transaction => {
        resolve(transaction);
      });
  });
};

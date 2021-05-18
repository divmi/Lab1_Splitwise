const GroupInfo = require("../Model/GroupInfoModel");
const TransactionDetail = require("../Model/TransactionDetailModel");
const OwsGetsDetail = require("../Model/OwsGetsDetailModel");
const User = require("../Model/UserRegistrationModel");

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

exports.getOwsGetsDetail = async args => {
  return new Promise(async (resolve, reject) => {
    OwsGetsDetail.find({ GroupID: args })
      .populate("GroupID", ["GroupName"])
      .populate("MemberOws", ["Name", "UserProfilePic"])
      .populate("MemberGets", ["Name", "UserProfilePic"])
      .then(transaction => {
        resolve(transaction);
      });
  });
};

exports.getGroupMemberName = async args => {
  return new Promise(async (resolve, reject) => {
    GroupInfo.find({ _id: args })
      .populate("GroupMemberInfo.ID", ["Name", "Email", "UserProfilePic"])
      .then(memberName => {
        resolve(memberName);
      });
  });
};

exports.getAllUser = async args => {
  return new Promise(async (resolve, reject) => {
    User.find({}, (error, user) => {
      if (error) {
        resolve({ status: 500 });
      } else if (user) {
        resolve(user);
      }
    });
  });
};

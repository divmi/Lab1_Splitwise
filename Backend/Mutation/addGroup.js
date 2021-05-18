const GroupInfo = require("../Model/GroupInfoModel");
const mongoose = require("mongoose");

const addGroup = async args => {
  return new Promise(async (resolve, reject) => {
    var memberList = [];
    args.GroupMemberInfo.map(id => {
      memberList.push({
        ID: mongoose.Types.ObjectId(id),
        Accepted: true
      });
    });
    var groupInfo = new GroupInfo({
      GroupName: args.GroupName,
      GroupProfilePicture: args.GroupProfilePicture,
      GroupMemberInfo: memberList
    });
    groupInfo.save((error, data) => {
      if (error) {
        resolve({ status: 500 });
      } else {
        resolve({ status: 200 });
      }
    });
  });
};

exports.addGroup = addGroup;

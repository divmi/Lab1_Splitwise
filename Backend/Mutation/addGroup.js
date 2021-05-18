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

exports.editGroup = async args => {
  GroupInfo.findOne({ _id: req.prevGroupName }, (error, findGroup) => {
    if (error) {
      callback(error, "Error");
    }
    if (findGroup) {
      const updateDoc = {
        $set: {
          GroupName: req.newGroupName,
          GroupProfilePicture: req.groupPhoto
        }
      };
      GroupInfo.updateOne(
        { _id: req.prevGroupName },
        updateDoc,
        (error, success) => {
          if (error) {
            callback(error, "Error");
          }
          if (success) {
            if (Object.keys(req.itemDeleted).length !== 0) {
              GroupInfo.updateOne(
                { _id: req.prevGroupName },
                {
                  $pull: {
                    GroupMemberInfo: { ID: req.itemDeleted.ID }
                  }
                },
                (error, success) => {
                  if (success) {
                    callback(null, success);
                  }
                }
              );
            } else {
              callback(null, success);
            }
          }
        }
      );
    }
  });
};

const GroupInfo = require("./../Model/GroupInfoModel");

const getGroup = async args => {
  return new Promise(async (resolve, reject) => {
    const groupInfo = await GroupInfo.find({
      "GroupMemberInfo.ID": { $all: args }
    }).populate("GroupMemberInfo.ID", ["Name", "Email", "UserProfilePic"]);
    resolve(groupInfo);
  });
};

exports.getGroup = getGroup;

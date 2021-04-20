const GroupInfo = require("../Model/GroupInfoModel");

function handle_request(msg, callback) {
  console.log("Inside book kafka backend");
  var memberList = [];
  msg.userData.map(user => {
    memberList.push({
      ID: user.ID,
      Accepted: user.Accepted
    });
  });
  var groupInfo = new GroupInfo({
    GroupName: msg.groupName,
    GroupProfilePicture: msg.groupPhoto,
    GroupMemberInfo: memberList
  });
  groupInfo.save((error, data) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, data);
    }
  });
}

exports.handle_request = handle_request;

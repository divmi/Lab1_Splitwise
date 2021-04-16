const GroupInfo = require("../Model/GroupInfoModel");

function handle_request(body, callback) {
  console.log("Update Group Request Handled");
  console.log(body.user_id);
  const query = { _id: body.name._id, "GroupMemberInfo.ID": body.id };
  const updateDocument = {
    $set: { "GroupMemberInfo.$.Accepted": true }
  };
  GroupInfo.updateOne(query, updateDocument, (error, success) => {
    if (error) {
      callback(error, "Error");
    } else {
      callback(null, success);
    }
  });
}

exports.handle_request = handle_request;

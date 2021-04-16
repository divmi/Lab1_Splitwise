const GroupInfo = require("../Model/GroupInfoModel");

function handle_request(body, callback) {
  GroupInfo.find({ "GroupMemberInfo.ID": { $all: ID } })
    .populate("GroupMemberInfo.ID", ["Name", "Email", "UserProfilePic"])
    .then(grp => {
      callback(null, grp);
      //   res.writeHead(200, {
      //     "Content-Type": "text/plain"
      //   });
      //   res.end(JSON.stringify(grp));
    });
}

exports.handle_request = handle_request;

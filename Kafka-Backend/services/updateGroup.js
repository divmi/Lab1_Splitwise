const GroupInfo = require("../Model/GroupInfoModel");

function handle_request(req, callback) {
  console.log("Update Group Request Handled");
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
              GroupInfo.deleteOne(
                { GroupName: req.prevGroupName },
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
}

exports.handle_request = handle_request;

const bodyParser = require("body-parser");
const Users = require("./Model/UserRegistrationModel");
const GroupInfo = require("./Model/GroupInfoModel");

var update = class update {
  updateUserProfile(con, req, res) {
    const filter = { _id: req._id };
    const updateDoc = {
      $set: {
        Name: req.Name,
        ContactNo: req.ContactNo,
        Currency: req.Currency,
        Timezone: req.Timezone,
        Language: req.Language,
        UserProfilePic: req.UserProfilePic,
      },
    };
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(result));
    });
  }

  updateGroup(req, res) {
    GroupInfo.findOne({ GroupName: req.prevGroupName }, (error, findGroup) => {
      if (error) {
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });
        res.end();
      }
      if (findGroup) {
        const updateDoc = {
          $set: {
            GroupName: req.newGroupName,
            GroupProfilePicture: req.groupPhoto,
          },
        };
        GroupInfo.updateOne(
          { GroupName: req.prevGroupName },
          updateDoc,
          (error, success) => {
            if (error) {
              res.writeHead(500, {
                "Content-Type": "text/plain",
              });
              res.end();
            }
            if (success) {
              if (Object.keys(req.itemDeleted).length !== 0) {
                GroupInfo.deleteOne(
                  { GroupName: req.prevGroupName },
                  (error, success) => {
                    if (success) {
                      res.writeHead(200, {
                        "Content-Type": "application/json",
                      });
                      res.end(JSON.stringify(success));
                    }
                  }
                );
              }
            }
          }
        );
      }
    });
  }
};

module.exports = {
  update,
};

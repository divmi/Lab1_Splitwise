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
    Users.updateOne(filter, updateDoc, (error, result) => {
      if (error) {
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });
        res.end();
      } else {
        res.writeHead(200, {
          "Content-Type": "application/json",
        });
        res.end(JSON.stringify(result));
      }
    });
  }

  updateGroup(req, res) {
    GroupInfo.findOne({ _id: req.prevGroupName }, (error, findGroup) => {
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
          { _id: req.prevGroupName },
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
              } else {
                res.writeHead(200, {
                  "Content-Type": "application/json",
                });
                res.end(JSON.stringify(success));
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

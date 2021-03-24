const bodyParser = require("body-parser");
const Users = require("./Model/UserRegistrationModel");

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

  updateGroup(con, req, res) {
    var sql =
      `UPDATE 
      GroupInfo
      SET 
      GroupName = '` +
      req.newGroupName +
      `',
      GroupProfilePicture = '` +
      req.groupPhoto +
      "'Where GroupName ='" +
      req.prevGroupName +
      "'";
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      if (Object.keys(req.itemDeleted).length !== 0) {
        var deleteMember =
          "Delete from GroupMemberInfo where Memberid='" +
          req.itemDeleted.Email +
          "' and GroupName='" +
          req.prevGroupName +
          "'";
        con.query(deleteMember, function (err, result, fields) {
          if (err) throw err;
        });
      }
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify(result));
    });
  }
};

module.exports = {
  update,
};

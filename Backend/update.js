const bodyParser = require("body-parser");
var mysql = require("mysql");
var update = class update {
  updateUserProfile(con, req, res) {
    var sql =
      `UPDATE 
      UserRegistration
      SET 
      Name = '` +
      req.Name +
      `', 
      ContactNo = '` +
      req.ContactNo +
      `',
      Currency = '` +
      req.Currency +
      `',
      Timezone = '` +
      req.Timezone +
      `',
      UserProfilePic = '` +
      req.UserProfilePic +
      `',
      Language = '` +
      req.Language +
      "'Where Email ='" +
      req.Email +
      "'";
    console.log(sql);
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      console.log(JSON.stringify(result));
      res.end(JSON.stringify(result));
    });
  }

  updateGroup(con, req, res) {
    var sql =
      `UPDATE 
      GroupInfo
      SET 
      DisplayGroupName = '` +
      req.newGroupName +
      `',
      GroupProfilePicture = '` +
      req.groupPhoto +
      "'Where GroupName ='" +
      req.prevGroupName +
      "'";
    console.log(sql);
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
      console.log(JSON.stringify(result));
      res.end(JSON.stringify(result));
    });
  }
};

module.exports = {
  update,
};

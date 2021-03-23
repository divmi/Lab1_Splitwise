const Users = require("./Model/UserRegistrationModel");
const GroupInfo = require("./Model/GroupInfoModel");
var group = class group {
  getAllUser(res) {
    Users.find({}, (error, user) => {
      if (error) {
        res.writeHead(401, {
          "Content-Type": "text/plain",
        });
        res.end("Not able to read users");
      } else if (user) {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end(JSON.stringify(user));
      }
    });
  }

  getGroupDetail(email, res) {
    console.log("Control came here :" + email);
    GroupInfo.find(
      { "GroupMemberInfo.MemberID": { $all: email } },
      (error, grp) => {
        if (error) {
          res.writeHead(401, {
            "Content-Type": "text/plain",
          });
        } else if (grp) {
          console.log(JSON.stringify(grp));
        }
      }
    );
  }

  getGroupNotification(con, email, res) {
    console.log("Connected!");
    var sql =
      "Select * from GroupMemberInfo where MemberID='" +
      email +
      "' and Accepted=false";
    con.query(sql, function (err, result) {
      if (err) throw err;
      if (result) {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end(JSON.stringify(result));
      } else {
        res.writeHead(401, {
          "Content-Type": "text/plain",
        });
        res.end("UnSuccessful Login");
      }
    });
  }

  gettransactionDetail(con, name, res) {
    console.log("Connected!");
    var sql =
      "Select detail.*, userinfo.Name , g.GroupProfilePicture from TransactionDetail as detail INNER JOIN UserRegistration as userinfo ON (detail.MemberID=userinfo.Email) Inner Join GroupInfo as g on (detail.GroupName=g.GroupName) where g.GroupName='" +
      name +
      "'" +
      "order by Time desc";
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      if (result) {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end(JSON.stringify(result));
      } else {
        res.writeHead(401, {
          "Content-Type": "text/plain",
        });
        res.end("UnSuccessful Login");
      }
    });
  }

  getTransactionFromUser(con, email, res) {
    console.log("Connected!");
    var sql =
      "Select detail.*, userinfo.Name , userinfo.Currency from TransactionDetail as detail INNER JOIN UserRegistration " +
      "as userinfo ON (detail.MemberID=userinfo.Email) where GroupName In(Select GroupName " +
      "from GroupMemberInfo where MemberID='" +
      email +
      "') ORDER BY Time desc";
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      if (result) {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end(JSON.stringify(result));
      } else {
        res.writeHead(401, {
          "Content-Type": "text/plain",
        });
        res.end("UnSuccessful Login");
      }
    });
  }
};

module.exports = {
  group,
};

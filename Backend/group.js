const Users = require("./Model/UserRegistrationModel");
var group = class group {
  getAllUser(body, res) {
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

  getGroupDetail(con, email, res) {
    // console.log("Connected!");
    // var sql =
    //   "Select * from GroupMemberInfo where MemberID='" +
    //   email +
    //   "' and Accepted=true";
    // con.query(sql, function (err, result) {
    //   if (err) throw err;
    //   if (result) {
    //     res.writeHead(200, {
    //       "Content-Type": "text/plain",
    //     });
    //     res.end(JSON.stringify(result));
    //   } else {
    //     res.writeHead(401, {
    //       "Content-Type": "text/plain",
    //     });
    //     res.end("UnSuccessful Login");
    //   }
    // });
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

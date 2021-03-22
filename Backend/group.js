var group = class group {
  getAllUser(con, body, res) {
    con.query("Select * from UserRegistration ", function (err, result) {
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

  UserLogin(con, body, res) {
    console.log("Connected!");
    var sql =
      "Select * from UserRegistration where Email='" +
      body.email +
      "'and Password='" +
      body.password +
      "'";
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      if (result[0].Password === body.password) {
        res.cookie("cookie", result[0].Email);
        console.log(res.cookie("cookie", result[0].Email));

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

  getGroupDetail(con, email, res) {
    console.log("Connected!");
    var sql =
      "Select * from GroupMemberInfo where MemberID='" +
      email +
      "' and Accepted=true";
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

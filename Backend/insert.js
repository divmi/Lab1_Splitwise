var mysql = require("mysql");

var insert = class insert {
  insert_user(con, body, res) {
    let userCount;
    var checkUser =
      "Select * from UserRegistration where Email='" + body.email + "'";
    con.query(checkUser, function (err, result) {
      if (err) throw err;
      if (result.length == 0) {
        console.log("Connected!");
        var sql =
          "INSERT INTO UserRegistration (Name, Password, Email) VALUES (";
        var sql1 =
          "'" + body.name + "','" + body.password + "','" + body.email + "')";
        console.log(sql + sql1);
        con.query(sql + sql1, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted" + result);
          res.writeHead(200, {
            "Content-Type": "text/plain",
          });
          res.end(JSON.stringify(result));
        });
      } else {
        res.writeHead(401, {
          "Content-Type": "text/plain",
        });
        res.end("User is already registered");
      }
    });
  }

  insert_Group(con, body, res) {
    console.log("Connected!");
    con.query(
      "Select * from GroupInfo where GroupName='" + body.groupName + "'",
      function (err, result) {
        if (err) throw err;
        if (result.length == 0) {
          var sql =
            "INSERT INTO GroupInfo (GroupName, GroupProfilePicture) VALUES (";
          var sql1 = "'" + body.groupName + "','" + body.groupPhoto + "')";
          console.log(sql + sql1);
          con.query(sql + sql1, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted" + result);
          });
          body.userData.map((value) => {
            var insGroupLink =
              "INSERT INTO GroupMemberInfo (GroupName, MemberID, Accepted) VALUES (";
            var insGroupLink1 =
              "'" + body.groupName + "','" + value.email + "','" + false + "')";
            con.query(insGroupLink + insGroupLink1, function (err, result) {
              if (err) throw err;
              console.log("1 record inserted" + result);
            });
          });

          var insGroupLink =
            "INSERT INTO GroupMemberInfo (GroupName, MemberID, Accepted) VALUES (";
          var insGroupLink1 =
            "'" + body.groupName + "','" + body.email + "','" + false + "')";
          con.query(insGroupLink + insGroupLink1, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted" + result);
          });

          res.writeHead(200, {
            "Content-Type": "text/plain",
          });
          res.end(JSON.stringify(result));
        } else {
          res.writeHead(401, {
            "Content-Type": "text/plain",
          });
          res.end("Group Name is already registered");
        }
      }
    );
  }

  insert_Transaction(con, body, res) {
    console.log("Connected!");
    var insGroupLink =
      "INSERT INTO TransactionDetail (TransactionDetail, Time, MemberID, GroupName, Amount) VALUES (";
    var insGroupLink1 =
      "'" +
      body.transactionDetail +
      "','" +
      `${new Date().toISOString().slice(0, 19).replace("T", " ")}` +
      "','" +
      body.memberID +
      "','" +
      body.groupname +
      "','" +
      body.amount +
      "')";
    console.log(insGroupLink + insGroupLink1);
    con.query(insGroupLink + insGroupLink1, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted" + result);
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end(JSON.stringify(result));
    });
  }
};

module.exports = {
  insert,
};

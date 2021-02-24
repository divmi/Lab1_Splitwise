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

  checkUserExist(con, email, res) {
    console.log("Connected!");
  }

  insert_Group(con, body, res) {
    console.log("Connected!");
    let id;
    let findGroup;
    con.query("Select * from GroupInfo", function (err, result) {
      if (err) throw err;
      if (result.length > 0) {
        const objectArray = Object.values(JSON.parse(JSON.stringify(result)));
        findGroup = objectArray.find((x) => x.GroupName === body.groupName);
      }
      if (!findGroup) {
        id = ++result.length;
        var sql =
          "INSERT INTO GroupInfo (GroupID, GroupName, GroupProfilePicture) VALUES (";
        var sql1 =
          "'" + id + "','" + body.groupName + "','" + body.groupPhoto + "')";
        console.log(sql + sql1);
        con.query(sql + sql1, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted" + result);
        });
        body.userData.map((value) => {
          var insGroupLink =
            "INSERT INTO GroupMemberInfo (GroupID, MemberID, Accepted) VALUES (";
          var insGroupLink1 =
            "'" + id + "','" + value.email + "','" + false + "')";
          con.query(insGroupLink + insGroupLink1, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted" + result);
          });
        });
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end(JSON.stringify(result));
      } else {
        res.writeHead(401, {
          "Content-Type": "text/plain",
        });
        res.end("User is already registered");
      }
    });
  }
};

module.exports = {
  insert,
};

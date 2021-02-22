var mysql = require("mysql");

var insert = class insert {
  insert_user(con, body, res) {
    console.log("Connected!");
    var sql = "INSERT INTO UserRegistration (Name, Password, Email) VALUES (";
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
  }

  insert_Group(con, body, res) {
    console.log("Connected!");
    let id;
    con.query("Select * from GroupInfo", function (err, result) {
      if (err) throw err;
      var sql = "INSERT INTO GroupInfo (GroupID, GroupName) VALUES (";
      var sql1 = "'" + ++result.length + "','" + body.groupName + "')";
      id = ++result.length;
      console.log(sql + sql1);
      con.query(sql + sql1, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted" + result);
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end(JSON.stringify(result));
      });
    });
    for (var value in body.userData) {
      var insGroupLink =
        "INSERT INTO GroupMemberInfo (GroupID, MemberID, Accepted) VALUES (";
      var insGroupLink1 = "'" + id + "','" + value.email + "','" + false + "')";
      con.query(insGroupLink + insGroupLink1, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted" + result);
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end(JSON.stringify(result));
      });
    }
  }
};

module.exports = {
  insert,
};

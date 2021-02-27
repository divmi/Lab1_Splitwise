var mysql = require("mysql");

var group = class group {
  getUserDetail(con, email, res) {
    console.log("Connected!");
    var sql = "Select * from UserRegistration where Email='" + email + "'";
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("the record is " + JSON.stringify(result));
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
  getAllUser(con, body, res) {
    console.log("Connected!");
    con.query("Select * from UserRegistration ", function (err, result) {
      if (err) throw err;
      console.log("the record is " + result);
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
    var email = body.email;
    var password = body.password;
    var sql =
      "Select * from UserRegistration where Email='" +
      body.email +
      "'and Password='" +
      body.password +
      "'";
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("the record is " + result);
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
    var sql = "Select * from GroupMemberInfo where MemberID='" + email + "'";
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("the record is " + JSON.stringify(result));
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

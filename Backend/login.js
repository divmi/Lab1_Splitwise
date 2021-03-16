var mysql = require("mysql");
const bcrypt = require("bcrypt");

var login = class login {
  UserLogin(con, body, res) {
    console.log("Connected!");
    var sql =
      "Select Name, Email, Password from UserRegistration where Email='" +
      body.email +
      "'";

    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      if (result.length > 0) {
        console.log(result[0].Password);
        bcrypt.compare(
          body.password,
          result[0].Password,
          function (err, matchPassword) {
            if (err) return error;
            res.cookie("cookie", JSON.stringify(result[0]));
            if (matchPassword) {
              res.cookie("cookie", JSON.stringify(result[0]));
              res.writeHead(200, {
                "Content-Type": "text/plain",
              });
              res.end(JSON.stringify(result));
            } else {
              res.writeHead(401, {
                "Content-Type": "text/plain",
              });
            }
          }
        );
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
  login,
};

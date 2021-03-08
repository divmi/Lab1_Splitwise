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
      console.log("the record is " + result);
      if (
        result.length > 0 &&
        bcrypt.compare(body.password, result[0].Password)
      ) {
        res.cookie("cookie", JSON.stringify(result[0]));
        console.log(res.cookie("cookie", JSON.stringify(result[0])));
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
  login,
};

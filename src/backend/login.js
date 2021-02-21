var mysql = require("mysql");

var login = class login {
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
};

module.exports = {
  login,
};

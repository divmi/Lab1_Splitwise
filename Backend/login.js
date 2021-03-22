const bcrypt = require("bcrypt");
const Users = require("./Model/UserRegistrationModel");

var login = class login {
  UserLogin(body, res) {
    Users.findOne({ Email: body.email }, (error, user) => {
      if (error) {
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });
        res.end();
      }
      if (user) {
        bcrypt.compare(
          body.password,
          user.Password,
          function (err, matchPassword) {
            if (err) return error;
            if (matchPassword) {
              console.log(JSON.stringify(user));
              res.cookie("cookie", JSON.stringify(user.Email));
              res.writeHead(200, {
                "Content-Type": "text/plain",
              });
              res.end(JSON.stringify(user));
            } else {
              res.writeHead(401, {
                "Content-Type": "text/plain",
              });
              res.end("UnSuccessful Login");
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

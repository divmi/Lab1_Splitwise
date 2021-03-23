const bcrypt = require("bcrypt");
const Users = require("./Model/UserRegistrationModel");

const jwt = require("jsonwebtoken");
const { secret } = require("./config");
const { auth } = require("./passport");

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
              const payload = { _id: user._id, email: user.Email };
              const token = jwt.sign(payload, secret, {
                expiresIn: 1008000,
              });
              const userData = {
                _id: user._id,
                Name: user.Name,
                Email: user.Email,
                Currency: user.Currency,
                Timezone: user.Timezone,
                Language: user.Language,
                ContactNo: user.ContactNo,
                UserProfilePic: user.UserProfilePic,
                token: token,
              };
              console.log(JSON.stringify(userData));

              res.cookie("cookie", JSON.stringify(userData));
              res.writeHead(200, {
                "Content-Type": "text/plain",
              });
              res.end(JSON.stringify(userData));
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

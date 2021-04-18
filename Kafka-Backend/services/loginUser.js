const Users = require("../Model/UserRegistrationModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { secret } = require("../../Backend/Utils/config");

function handle_request(body, callback) {
  Users.findOne({ Email: body.email }, (error, user) => {
    if (error) {
      callback(error, "UnSuccessful Login");
    }
    if (user) {
      bcrypt.compare(
        body.password,
        user.Password,
        function (err, matchPassword) {
          if (err) return error;
          if (matchPassword) {
            const token = createToken(user);
            const userData = {
              _id: user._id,
              Name: user.Name,
              Email: user.Email,
              Currency: user.Currency,
              Timezone: user.Timezone,
              Language: user.Language,
              ContactNo: user.ContactNo,
              UserProfilePic: user.UserProfilePic,
              token: token
            };
            callback(null, userData);
          } else {
            callback(error, "UnSuccessful Login");
          }
        }
      );
    } else {
      callback(error, "UnSuccessful Login");
    }
  });
}

function createToken(user) {
  const payload = { id: user._id };
  const token = jwt.sign(payload, secret, {
    expiresIn: 1008000
  });
  return "JWT " + token;
}

exports.handle_request = handle_request;

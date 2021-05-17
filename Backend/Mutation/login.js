const Users = require("../Model/UserRegistrationModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { secret } = require("../../Backend/Utils/config");

const login = async args => {
  return new Promise(async (resolve, reject) => {
    await Users.findOne({ Email: args.email }, (error, user) => {
      if (error) {
        resolve({ status: 500, message: "Unscuccessful Login" });
      }
      if (user) {
        bcrypt.compare(
          args.password,
          user.Password,
          function (err, matchPassword) {
            if (err) return error;
            if (matchPassword) {
              const token = createToken(user);
              const userData = {
                token: token,
                _id: user._id,
                Name: user.Name,
                Email: user.Email,
                Currency: user.Currency,
                Timezone: user.Timezone,
                Language: user.Language,
                ContactNo: user.ContactNo,
                UserProfilePic: user.UserProfilePic,
                status: 200,
                message: "Successfully"
              };
              resolve(userData);
            } else {
              const userData = {
                status: 500,
                message: "Reject"
              };
              resolve(userData);
            }
          }
        );
      } else {
        resolve({ status: 500, message: "Unscuccessful Login" });
      }
    });
  });
};

function createToken(user) {
  const payload = { id: user._id };
  const token = jwt.sign(payload, secret, {
    expiresIn: 1008000
  });
  return "JWT " + token;
}

exports.login = login;

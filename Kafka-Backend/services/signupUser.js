const Users = require("../Model/UserRegistrationModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { secret } = require("../../Backend/Utils/config");

async function handle_request(body, callback) {
  try {
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    body.password = await bcrypt.hash(body.password, salt);
    console.log("Registering New User");
    const newUser = {
      Name: body.name,
      Email: body.email,
      Password: body.password,
      Currency: "$",
      Timezone: "(GMT-08:00) Pacific Time",
      Language: "English",
      ContactNo: "9999999999",
      UserProfilePic: ""
    };
    new Users(newUser).save((error, data) => {
      if (error) {
        callback(error, null);
      } else {
        newUser._id = data._id;
        const token = createToken(newUser);
        newUser.token = token;
        newUser.Password = "";
        console.log(newUser);
        callback(null, newUser);
      }
    });
  } catch (err) {
    callback(err, null);
    console.log(err);
  }
}

function createToken(user) {
  const payload = { id: user._id };
  const token = jwt.sign(payload, secret, {
    expiresIn: 1008000
  });
  return "JWT " + token;
}

exports.handle_request = handle_request;

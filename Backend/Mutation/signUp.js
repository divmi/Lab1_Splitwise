const Users = require("../Model/UserRegistrationModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { secret } = require("../../Backend/Utils/config");

const signUp = async args => {
  return new Promise(async (resolve, reject) => {
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    args.password = await bcrypt.hash(args.password, salt);
    console.log("Registering New User");
    const newUser = {
      Name: args.name,
      Email: args.email,
      Password: args.password,
      Currency: "$",
      Timezone: "(GMT-08:00) Pacific Time",
      Language: "English",
      ContactNo: "9999999999",
      UserProfilePic: ""
    };
    new Users(newUser).save((error, data) => {
      if (error) {
        resolve({ status: 500, message: "User is already registered" });
      } else {
        newUser._id = data._id;
        const token = createToken(newUser);
        newUser.token = token;
        newUser.Password = "";
        newUser.status = 200;
        newUser.message = "Registration Successfully";
        console.log(newUser);
        resolve(newUser);
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

exports.signUp = signUp;

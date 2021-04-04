const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var userRegisterSchema = new Schema(
  {
    Name: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    ContactNo: { type: String },
    Currency: { type: String },
    Timezone: { type: String },
    Language: { type: String },
    UserProfilePic: { type: String },
  },
  {
    versionKey: false,
  }
);

const userModel = mongoose.model("UserRegistration", userRegisterSchema);
module.exports = userModel;

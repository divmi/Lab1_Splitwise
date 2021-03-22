const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var groupInfoSchema = new Schema(
  {
    GroupName: { type: String, required: true },
    GroupProfilePicture: { type: String },
  },
  {
    versionKey: false,
  }
);

const userModel = mongoose.model("GroupInfo", groupInfoSchema);
module.exports = userModel;

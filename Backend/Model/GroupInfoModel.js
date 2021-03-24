const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var groupInfoSchema = new Schema(
  {
    GroupName: { type: String, required: true },
    GroupProfilePicture: { type: String },
    GroupMemberInfo: [
      {
        ID: { type: Schema.Types.ObjectId },
        MemberID: { type: String, require: true },
        UserProfilePic: { type: String },
        Accepted: { type: Boolean, defaultValue: false },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const userModel = mongoose.model("GroupInfo", groupInfoSchema);
module.exports = userModel;

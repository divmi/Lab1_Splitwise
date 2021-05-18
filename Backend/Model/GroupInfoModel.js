const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var groupInfoSchema = new Schema(
  {
    GroupName: { type: String, required: true, unique: true },
    GroupProfilePicture: { type: String },
    GroupMemberInfo: [
      {
        ID: { type: Schema.Types.ObjectId, ref: "UserRegistration" },
        Accepted: { type: Boolean, defaultValue: false }
      }
    ]
  },
  {
    versionKey: false
  }
);

const userModel = mongoose.model("GroupInfo", groupInfoSchema);
module.exports = userModel;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var groupMemberInfoSchema = new Schema(
  {
    GroupName: { type: String, required: true },
    MemberID: { type: String, required: true },
    Accepted: { type: Boolean, required: true },
    GroupInfo: [{ type: Schema.Types.ObjectId, ref: "GroupInfo" }],
  },
  {
    versionKey: false,
  }
);

const userModel = mongoose.model("GroupMemberInfo", groupMemberInfoSchema);
module.exports = userModel;

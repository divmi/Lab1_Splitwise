const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var comments = new Schema(
  {
    TransactionID: { type: Schema.Types.ObjectId, ref: "TransactionDetail" },
    GroupName: { type: String, required: true },
    MemberCommented: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const grpComments = mongoose.model("GroupMemberComments", comments);
module.exports = grpComments;

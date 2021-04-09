const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var Comment = new Schema(
  {
    Trans_ID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "TransactionDetail",
    },
    Time: { type: Date, default: Date.now },
    comments: [
      {
        MemberCommented: {
          type: Schema.Types.ObjectId,
          ref: "UserRegistration",
          required: true,
        },
        Comment: { type: String },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const transModel = mongoose.model("Comment", Comment);
module.exports = transModel;

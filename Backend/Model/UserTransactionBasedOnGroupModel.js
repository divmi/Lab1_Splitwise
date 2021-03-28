const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var userTransactionOnGroup = new Schema(
  {
    TransactionID: { type: Schema.Types.ObjectId, ref: "TransactionDetail" },
    GroupName: { type: String, required: true },
    MemberPaid: { type: String, required: true },
    MemberOws: { type: String, required: true },
    Amount: { type: float, required: true },
  },
  {
    versionKey: false,
  }
);

const grpTransactionOnGroup = mongoose.model(
  "UserTransactionBasedOnGroup",
  userTransactionOnGroup
);
module.exports = grpTransactionOnGroup;

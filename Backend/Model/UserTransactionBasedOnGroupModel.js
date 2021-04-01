const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var userTransactionOnGroup = new Schema(
  {
    TransactionID: { type: Schema.Types.ObjectId, ref: "TransactionDetail" },
    GroupID: {
      type: Schema.Types.ObjectId,
      ref: "GroupInfo",
      required: true,
    },
    MemberGets: {
      type: Schema.Types.ObjectId,
      ref: "UserRegistration",
      required: true,
    },
    MemberOws: {
      type: Schema.Types.ObjectId,
      ref: "UserRegistration",
      required: true,
    },
    Amount: { type: Number, required: true },
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

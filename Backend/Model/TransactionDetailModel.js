const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var transactionDetail = new Schema(
  {
    TransactionDetail: { type: String, required: true },
    Time: { type: datetime, required: true },
    MemberID: {
      type: Schema.Types.ObjectId,
      ref: "UserRegistration",
      required: true,
    },
    GroupName: {
      type: Schema.Types.ObjectId,
      ref: "GroupInfo",
      required: true,
    },
    Amount: { type: float, required: true },
    SettleUpWith: { type: String },
  },
  {
    versionKey: false,
  }
);

const transModel = mongoose.model("TransactionDetail", transactionDetail);
module.exports = transModel;

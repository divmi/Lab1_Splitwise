const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var owsGetsDetail = new Schema(
  {
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
    GroupID: {
      type: Schema.Types.ObjectId,
      ref: "GroupInfo",
      required: true,
    },
    Amount: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

const detail = mongoose.model("OwsGetsDetail", owsGetsDetail);
module.exports = detail;

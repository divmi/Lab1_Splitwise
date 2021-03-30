const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var owsGetsDetail = new Schema(
  {
    MemberGets: { type: String, required: true },
    MemberOws: { type: String, required: true },
    Amount: { type: Schema.Types.Decimal128, required: true },
    MemberGetsName: { type: String, required: true },
    MemberOwsName: { type: String, required: true },
    MemberProfilePicGets: { type: String, required: true },
    MemberProfilePicOws: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const detail = mongoose.model("OwsGetsDetail", owsGetsDetail);
module.exports = detail;

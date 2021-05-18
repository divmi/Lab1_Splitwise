const TransactionModel = require("../Model/TransactionDetailModel");
const UserTransactionBasedOnGroup = require("../Model/UserTransactionBasedOnGroupModel");
const OwsGetsDetail = require("../Model/OwsGetsDetailModel");

const settleUp = async args => {
  OwsGetsDetail.deleteMany(
    {
      $or: [
        { MemberOws: body.MemberOws, MemberGets: body.MemberID },
        { MemberOws: body.MemberID, MemberGets: body.MemberOws }
      ]
    },
    (error, result) => {
      if (error) {
      } else {
        UserTransactionBasedOnGroup.deleteMany(
          {
            $or: [
              { MemberOws: body.MemberOws, MemberGets: body.MemberID },
              { MemberOws: body.MemberID, MemberGets: body.MemberOws }
            ]
          },
          (error, result) => {
            if (error) {
              callback(error, "Error");
            }
          }
        );
        var insTransaction = new TransactionModel({
          TransactionDetail: "Settled Up",
          MemberID: body.MemberID,
          Amount: body.Amount,
          SettleUpWith: body.RealID,
          GroupID: body.GroupID
        });
        insTransaction.save((error, data) => {
          if (error) {
            callback(error, "Error");
          } else {
            callback(null, data);
          }
        });
      }
    }
  );
};

exports.settleUp = settleUp;

const OwsGetsDetail = require("../Model/OwsGetsDetailModel");
const UserTransactionBasedOnGroup = require("../Model/UserTransactionBasedOnGroupModel");
const TransactionModel = require("../Model/TransactionDetailModel");

function handle_request(body, callback) {
  console.log("Update Group Request Handled");
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
}

exports.handle_request = handle_request;

var mysql = require("mysql");

class transactionDetail {
  getOwsGetsDetail(con, groupName, res) {
    let transactionlist = [];
    var sql =
      "Select * from UserTransactionBasedOnGroup where GroupName='" +
      groupName +
      "'";

    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("the record is " + result);
      if (result.length > 0) {
        con.query(
          "Select MemberID from GroupMemberInfo where GroupName ='" +
            groupName +
            "'",
          function (err, memberInfo) {
            if (err) throw err;
            if (memberInfo.length > 0) {
              for (let value = 0; value < memberInfo.length; value++) {
                for (
                  let member = value + 1;
                  member < memberInfo.length;
                  member++
                ) {
                  transactionlist.push({
                    MemberPaid: memberInfo[value].MemberID,
                    MemberOws: memberInfo[member].MemberID,
                    Amount: 0,
                  });
                }
              }
              console.log(transactionlist);
            }

            if (transactionlist.length > 0) {
              for (let value of transactionlist) {
                let sum = 0;
                let sum2 = 0;
                const memberId = result.filter(
                  (x) =>
                    x.MemberPaid == value.MemberPaid &&
                    x.MemberOws == value.MemberOws
                );
                if (memberId.length > 0) {
                  for (let value of memberId) {
                    sum += value.Amount;
                  }
                }
                const member2Id = result.filter(
                  (x) =>
                    x.MemberPaid == value.MemberOws &&
                    x.MemberOws == value.MemberPaid
                );
                if (typeof member2Id != "undefined" && member2Id.length > 0) {
                  for (let value of member2Id) {
                    sum2 += value.Amount;
                  }
                }
                value.Amount = sum - sum2;
              }
              console.log(transactionlist);
              res.end(JSON.stringify(transactionlist));
            }
          }
        );
      } else {
        res.writeHead(401, {
          "Content-Type": "text/plain",
        });
        res.end("UnSuccessful Login");
      }
    });
  }
}

module.exports = {
  transactionDetail,
};

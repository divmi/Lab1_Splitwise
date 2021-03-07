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
            "'and Accepted=true",
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
              transactionlist.map((value) => {
                con.query(
                  "Delete from  OwsGetsDetail where GroupName ='" +
                    groupName +
                    "', MemberPaid='" +
                    value.MemberPaid +
                    "'and MemberOws='" +
                    value.MemberOws +
                    "'",
                  function (err, memberInfo) {
                    if (err) throw err;
                    console.log("1 record Deleted" + result);
                  }
                );
                // if (value.Amount < 0) {
                //   let memberPaid = value.MemberOws;
                //   value.MemberOws = value.MemberPaid;
                //   value.MemberPaid = memberPaid;
                // }

                var insGroupLink =
                  "INSERT INTO OwsGetsDetail (MemberGets, MemberOws, Amount, GroupName, MemberGetsName, MemberOwsName) VALUES (";
                var insGroupLink1 =
                  "'" +
                  value.MemberPaid +
                  "','" +
                  value.MemberOws +
                  "','" +
                  value.Amount +
                  "','" +
                  groupName +
                  "','" +
                  value.Amount +
                  "','" +
                  value.Amount +
                  "')";
                con.query(insGroupLink + insGroupLink1, function (err, result) {
                  if (err) throw err;
                  console.log("1 record inserted" + result);
                });
              });
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

  groupJoinRequest(con, body, res) {
    var sql =
      "UPDATE GroupMemberInfo SET Accepted = true Where MemberId ='" +
      body.MemberID +
      "' AND GroupName = '" +
      body.GroupName +
      "'";
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      console.log(JSON.stringify(result));
      res.end(JSON.stringify(result));
    });
  }
}

module.exports = {
  transactionDetail,
};

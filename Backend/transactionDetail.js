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
              for (let member1 = 0; member1 < memberInfo.length; member1++) {
                for (
                  let member2 = member1 + 1;
                  member2 < memberInfo.length;
                  member2++
                ) {
                  let member1ToMember2TransList = result.filter(
                    (x) =>
                      x.MemberPaid == memberInfo[member1].MemberID &&
                      x.MemberOws == memberInfo[member2].MemberID
                  );
                  let member1GetsFromMember2 = 0;
                  let member2GetsFromMember1 = 0;
                  if (member1ToMember2TransList.length > 0) {
                    member1ToMember2TransList.forEach((element) => {
                      member1GetsFromMember2 += element.Amount;
                    });
                  }

                  let member2ToMember1TransList = result.filter(
                    (x) =>
                      x.MemberPaid == memberInfo[member2].MemberID &&
                      x.MemberOws == memberInfo[member1].MemberID
                  );
                  if (member2ToMember1TransList.length > 0) {
                    member2ToMember1TransList.forEach((element) => {
                      member2GetsFromMember1 += element.Amount;
                    });
                  }
                  let finalValue =
                    member1GetsFromMember2 - member2GetsFromMember1;
                  transactionlist.push({
                    MemberPaid: memberInfo[member1].MemberID,
                    MemberOws: memberInfo[member2].MemberID,
                    Amount: finalValue,
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
              transactionlist.map((value) => {
                con.query(
                  "Delete from  OwsGetsDetail where GroupName ='" +
                    groupName +
                    "'and MemberGets='" +
                    value.MemberPaid +
                    "'and MemberOws='" +
                    value.MemberOws +
                    "'",
                  function (err, memberInfo) {
                    if (err) throw err;
                    console.log("1 record Deleted" + result);
                  }
                );

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

  getUserSpecificGetOwsInfo(con, email, res) {
    var sql =
      "SELECT * FROM SplitwiseDB.OwsGetsDetail where MemberGets='" +
      email +
      "'OR MemberOws='" +
      email +
      "'";
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("found record" + result);
      res.end(JSON.stringify(result));
    });
  }

  getGroupSummary(con, email, res) {
    var sql =
      "SELECT * FROM SplitwiseDB.OwsGetsDetail where GroupName='" + +groupName;
    ("'");
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("found record" + result);
      res.end(JSON.stringify(result));
    });
  }
}

module.exports = {
  transactionDetail,
};

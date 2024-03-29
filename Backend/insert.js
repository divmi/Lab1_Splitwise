"use strict";
var mysql = require("mysql");
const bcrypt = require("bcrypt");

class insert {
  async insert_user(con, body, res) {
    try {
      const salt = await bcrypt.genSalt(10);
      // now we set user password to hashed password
      body.password = await bcrypt.hash(body.password, salt);
      var checkUser =
        "Select * from UserRegistration where Email='" + body.email + "'";
      con.query(checkUser, function (err, result) {
        if (err) throw err;
        if (result.length == 0) {
          console.log("Connected!");
          var sql =
            "INSERT INTO UserRegistration (Name, Password, Email, Currency, Timezone, Language, ContactNo) VALUES (";
          var sql1 =
            "'" +
            body.name +
            "','" +
            body.password +
            "','" +
            body.email +
            "','" +
            "$" +
            "','" +
            "(GMT-08:00) Pacific Time" +
            "','" +
            "English" +
            "','" +
            "80XXXXXXXXX" +
            "')";
          console.log(sql + sql1);
          con.query(sql + sql1, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted" + result);
            let data = {
              Name: body.name,
              Email: body.email,
            };
            res.cookie("cookie", JSON.stringify(data));
            res.writeHead(200, {
              "Content-Type": "text/plain",
            });
            res.end(JSON.stringify(result));
          });
        } else {
          res.writeHead(401, {
            "Content-Type": "text/plain",
          });
          res.end("User is already registered");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  insert_Group(con, body, res) {
    console.log("Connected!");
    con.query(
      "Select * from GroupInfo where GroupName='" + body.groupName + "'",
      function (err, result) {
        if (err) throw err;
        if (result.length == 0) {
          let count = 0;
          var sql =
            "INSERT INTO GroupInfo (GroupName, GroupProfilePicture) VALUES (";
          var sql1 = "'" + body.groupName + "','" + body.groupPhoto + "')";
          console.log(sql + sql1);
          con.query(sql + sql1, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted" + result);
            body.userData.map((value) => {
              var insGroupLink =
                "INSERT INTO GroupMemberInfo (GroupName, MemberID, Accepted) VALUES (";
              var insGroupLink1 =
                "'" +
                body.groupName +
                "','" +
                value.Email +
                "','" +
                value.Accepted +
                "')";
              con.query(insGroupLink + insGroupLink1, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted" + result);
                // count++;
                // if (count == body.userData.length) {
                //   count = 0;
                //   var insGroupForMainMember =
                //     "INSERT INTO GroupMemberInfo (GroupName, MemberID, Accepted) VALUES (";
                //   var insGroupForMainMember1 =
                //     "'" +
                //     body.groupName +
                //     "','" +
                //     body.Email +
                //     "','" +
                //     1 +
                //     "')";
                //   con.query(
                //     insGroupForMainMember + insGroupForMainMember1,
                //     function (err, result) {
                //       if (err) throw err;
                // console.log("1 record inserted" + result);

                // }
                //);
                //}
              });
            });
            res.writeHead(200, {
              "Content-Type": "text/plain",
            });
            res.end(JSON.stringify(result));
          });
        } else {
          res.writeHead(401, {
            "Content-Type": "text/plain",
          });
          res.end("Group Name is already registered");
        }
      }
    );
  }

  async insert_TransactionForUserAndGroup(con, body, res) {
    const result = this.insert_Promise(con, body, res);
    console.log("member inserted");
    try {
      await this.FindGroupMemberList(con, body, res);
      console.log("member inserted successfully");
    } catch (e) {
      console.log("Error:" + e);
    }
  }

  getGroupMemberList(con, groupName, res) {
    con.query(
      "Select u.Name, u.Email, u.UserProfilePic, g.GroupProfilePicture from UserRegistration as u Inner Join GroupMemberInfo as gMember on (u.Email=gMember.MemberID) Inner Join GroupInfo as g on (gMember.GroupName=g.GroupName) where g.GroupName ='" +
        groupName +
        "' and Accepted=true",
      function (err, memberInfo) {
        if (memberInfo) {
          res.writeHead(200, {
            "Content-Type": "text/plain",
          });
          res.end(JSON.stringify(memberInfo));
        } else {
          res.writeHead(401, {
            "Content-Type": "text/plain",
          });
          res.end(err);
        }
      }
    );
  }

  FindGroupMemberList(con, body, res) {
    return new Promise((resolve, reject) => {
      con.query(
        " Select g.MemberID, u.Name, u.UserProfilePic from GroupMemberInfo as g Inner Join UserRegistration as u On (g.MemberID=u.Email) where g.GroupName ='" +
          body.groupname +
          "' and g.Accepted=true",
        (err, memberInfo) => {
          if (err) reject(err);
          return resolve(memberInfo);
        }
      );
    })
      .then((memberInfo) =>
        this.insert_MemberIntoUserTransactionTable(con, body, res, memberInfo)
      )
      .then((memberInfo) =>
        this.getOwsGetsDetail(con, body.groupname, res, memberInfo)
      );
  }

  insert_MemberIntoUserTransactionTable(con, body, res, memberlist) {
    return new Promise((resolve, reject) => {
      if (memberlist.length > 0) {
        var ows = body.amount / memberlist.length;
        for (let value of memberlist) {
          if (value.MemberID != body.memberID) {
            console.log("Transaction Inserted");
            var insertDetail =
              "INSERT INTO UserTransactionBasedOnGroup ( GroupName, MemberPaid, MemberOws, Amount) VALUES (";
            insertDetail =
              insertDetail +
              "'" +
              body.groupname +
              "','" +
              body.memberID +
              "','" +
              value.MemberID +
              "','" +
              ows +
              "')";
            con.query(insertDetail, (err, result) => {
              if (err) reject(err);
              resolve(memberlist);
              //res.end(JSON.stringify(result));
            });
          }
        }
      }
    });
  }

  insert_Promise(con, body, res) {
    var insGroupLink =
      "INSERT INTO TransactionDetail (TransactionDetail, Time, MemberID, GroupName, Amount) VALUES (";
    var insGroupLink1 =
      "'" +
      body.transactionDetail +
      "','" +
      `${new Date().toISOString().slice(0, 19).replace("T", " ")}` +
      "','" +
      body.memberID +
      "','" +
      body.groupname +
      "','" +
      body.amount +
      "')";
    //console.log(insGroupLink + insGroupLink1);
    con.query(insGroupLink + insGroupLink1, function (err, result) {
      if (err) throw err;
      console.log("Response sent to client");
    });
  }

  getOwsGetsDetail(con, groupName, res, memberInfo) {
    let transactionlist = [];
    var sql =
      "Select * from UserTransactionBasedOnGroup where GroupName='" +
      groupName +
      "'";
    con.query(sql, function (err, result) {
      if (err) throw console.log(err);
      if (result.length > 0) {
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
              let finalValue = member1GetsFromMember2 - member2GetsFromMember1;
              transactionlist.push({
                MemberPaid: memberInfo[member1].MemberID,
                MemberOws: memberInfo[member2].MemberID,
                Amount: finalValue,
                MemberGetsName: memberInfo[member1].Name,
                MemberOwsName: memberInfo[member2].Name,
                MemberProfilePicGets: memberInfo[member1].UserProfilePic,
                MemberProfilePicOws: memberInfo[member2].UserProfilePic,
              });
            }
          }
        }

        if (transactionlist.length > 0) {
          con.query(
            "Delete from  OwsGetsDetail where GroupName ='" + groupName + "'",
            function (err, result) {
              if (err) throw err;
              let count = 0;
              transactionlist.map((value) => {
                var insGroupLink =
                  "INSERT INTO OwsGetsDetail (MemberGets, MemberOws, Amount, GroupName, MemberGetsName, MemberOwsName,MemberProfilePicGets, MemberProfilePicOws) VALUES (";
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
                  value.MemberGetsName +
                  "','" +
                  value.MemberOwsName +
                  "','" +
                  value.MemberProfilePicGets +
                  "','" +
                  value.MemberProfilePicOws +
                  "')";
                con.query(insGroupLink + insGroupLink1, function (err, result) {
                  count++;
                  if (err) throw err;
                  console.log("1 record inserted" + result);
                  if (count == transactionlist.length) {
                    console.log("response sent successfully");
                    res.writeHead(200, {
                      "Content-Type": "text/plain",
                    });
                    res.write("Insert Completed");
                    res.end();
                  }
                });
              });
            }
          );
        }
      } else {
        if (result.length == 0 && memberInfo.length == 1) {
          res.writeHead(200, {
            "Content-Type": "text/plain",
          });
          res.write("Insert Completed");
          res.end();
        } else {
          res.writeHead(401, {
            "Content-Type": "text/plain",
          });
          res.end("UnSuccessful Login");
        }
      }
    });
  }

  settleUp(con, body, res) {
    console.log("Connected!");
    var settleUpUser =
      "Delete from OwsGetsDetail where MemberGets='" +
      body.MemberName +
      "' && MemberOws='" +
      body.settleUpWith +
      "' or MemberOws='" +
      body.MemberName +
      "' && MemberGets='" +
      body.settleUpWith +
      "'";
    console.log("settleup received");
    con.query(settleUpUser, function (err, result) {
      if (err) throw err;
      var deleteSettleUpTransaction =
        "Delete from UserTransactionBasedOnGroup where MemberPaid='" +
        body.MemberName +
        "' && MemberOws='" +
        body.settleUpWith +
        "' or MemberOws='" +
        body.MemberName +
        "' && MemberPaid='" +
        body.settleUpWith +
        "'";
      con.query(deleteSettleUpTransaction, function (err, result) {
        if (err) throw err;
        var addTransactionInTable =
          "INSERT INTO TransactionDetail (TransactionDetail, Time, MemberID, GroupName, Amount,SettleUpWith) VALUES (";
        var insTransaction =
          "'" +
          "SettleUp" +
          "','" +
          `${new Date().toISOString().slice(0, 19).replace("T", " ")}` +
          "','" +
          body.MemberName +
          "','" +
          body.GroupName +
          "','" +
          body.Amount +
          "','" +
          body.RealName +
          "')";
        con.query(
          addTransactionInTable + insTransaction,
          function (err, result) {
            if (err) throw err;
            res.writeHead(200, {
              "Content-Type": "text/plain",
            });
            res.end(JSON.stringify(result));
          }
        );
      });
    });
  }
}

module.exports = {
  insert,
};

"use strict";
var mysql = require("mysql");
const bcrypt = require("bcrypt");

class insert {
  async insert_user(con, body, res) {
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
          "INSERT INTO UserRegistration (Name, Password, Email, Currency, Timezone, Language) VALUES (";
        var sql1 =
          "'" +
          body.name +
          "','" +
          body.password +
          "','" +
          body.email +
          "','" +
          "USD" +
          "','" +
          "(GMT-08:00) Pacific Time" +
          "','" +
          "English" +
          "')";
        console.log(sql + sql1);
        con.query(sql + sql1, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted" + result);
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
  }

  insert_Group(con, body, res) {
    console.log("Connected!");
    con.query(
      "Select * from GroupInfo where GroupName='" + body.groupName + "'",
      function (err, result) {
        if (err) throw err;
        if (result.length == 0) {
          var sql =
            "INSERT INTO GroupInfo (GroupName, GroupProfilePicture) VALUES (";
          var sql1 = "'" + body.groupName + "','" + body.groupPhoto + "')";
          console.log(sql + sql1);
          con.query(sql + sql1, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted" + result);
          });
          body.userData.map((value) => {
            var insGroupLink =
              "INSERT INTO GroupMemberInfo (GroupName, MemberID, Accepted) VALUES (";
            var insGroupLink1 =
              "'" + body.groupName + "','" + value.email + "','" + false + "')";
            con.query(insGroupLink + insGroupLink1, function (err, result) {
              if (err) throw err;
              console.log("1 record inserted" + result);
            });
          });

          var insGroupLink =
            "INSERT INTO GroupMemberInfo (GroupName, MemberID, Accepted) VALUES (";
          var insGroupLink1 =
            "'" + body.groupName + "','" + body.email + "','" + false + "')";
          con.query(insGroupLink + insGroupLink1, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted" + result);
          });

          res.writeHead(200, {
            "Content-Type": "text/plain",
          });
          res.end(JSON.stringify(result));
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
  FindGroupMemberList(con, body, res) {
    return new Promise((resolve, reject) => {
      con.query(
        "Select MemberID from GroupMemberInfo where GroupName ='" +
          body.groupname +
          "' and Accepted=true",
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
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end(JSON.stringify(result));
    });
  }

  getOwsGetsDetail(con, groupName, res, memberInfo) {
    let transactionlist = [];
    var sql =
      "Select * from UserTransactionBasedOnGroup where GroupName='" +
      groupName +
      "'";
    console.log(sql);
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
              });
            }
          }
          console.log(transactionlist);
        }

        if (transactionlist.length > 0) {
          con.query(
            "Delete from  OwsGetsDetail where GroupName ='" + groupName + "'",
            function (err, result) {
              if (err) throw err;
              console.log("record Deleted" + result);
            }
          );
          transactionlist.map((value) => {
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
        }
      } else {
        res.writeHead(401, {
          "Content-Type": "text/plain",
        });
        res.end("UnSuccessful Login");
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
    con.query(settleUpUser, function (err, result) {
      if (err) throw err;
      var updateSettleUpTransaction =
        "Update UserTransactionBasedOnGroup Set Amount=0 where MemberPaid='" +
        body.MemberName +
        "' && MemberOws='" +
        body.settleUpWith +
        "' or MemberOws='" +
        body.MemberName +
        "' && MemberPaid='" +
        body.settleUpWith +
        "'";
      con.query(updateSettleUpTransaction, function (err, result) {
        if (err) throw err;
        console.log("record Updated Successfully");
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end(JSON.stringify(result));
      });
    });
  }
}

module.exports = {
  insert,
};

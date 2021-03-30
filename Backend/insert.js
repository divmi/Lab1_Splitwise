"use strict";
const bcrypt = require("bcrypt");
const Users = require("./Model/UserRegistrationModel");
const GroupInfo = require("./Model/GroupInfoModel");
const TransactionModel = require("./Model/TransactionDetailModel");
const UserTransactionBasedOnGroup = require("./Model/UserTransactionBasedOnGroupModel");
const OwsGetsDetail = require("./Model/OwsGetsDetailModel");

class insert {
  async insert_user(body, res) {
    try {
      const salt = await bcrypt.genSalt(10);
      // now we set user password to hashed password
      body.password = await bcrypt.hash(body.password, salt);
      Users.findOne({ Email: body.email }, (error, user) => {
        if (error) {
          res.writeHead(500, {
            "Content-Type": "text/plain",
          });
          res.end();
        }
        if (user) {
          res.writeHead(400, {
            "Content-Type": "text/plain",
          });
          res.end("User is already registered");
        } else {
          console.log("Came here");
          var newUser = new Users({
            Name: body.name,
            Email: body.email,
            Password: body.password,
            Currency: "$",
            Timezone: "(GMT-08:00) Pacific Time",
            Language: "English",
            ContactNo: "9999999999",
            UserProfilePic: "",
          });
          newUser.save((error, data) => {
            if (error) {
              res.writeHead(500, {
                "Content-Type": "text/plain",
              });
              res.end();
            } else {
              res.writeHead(200, { "Content-Type": "text/plain" });
              res.end();
            }
          });
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  insert_Group(body, res) {
    console.log("Connected!");
    GroupInfo.findOne({ GroupName: body.groupName }, (error, groupInfo) => {
      if (error) {
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });
        res.end();
      }
      if (groupInfo) {
        res.writeHead(400, {
          "Content-Type": "text/plain",
        });
        res.end("Group Name is already Registered");
      } else {
        var memberList = [];
        body.userData.map((user) => {
          memberList.push({
            ID: user.ID,
            Accepted: user.Accepted,
          });
        });
        var groupInfo = new GroupInfo({
          GroupName: body.groupName,
          GroupProfilePicture: body.groupPhoto,
          GroupMemberInfo: memberList,
        });
        groupInfo.save((error, data) => {
          if (error) {
            res.writeHead(500, {
              "Content-Type": "text/plain",
            });
            res.end();
          } else {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end();
          }
        });
      }
    });
  }

  async insert_TransactionForUserAndGroup(body, res) {
    const result = this.insert_Promise(body, res);
    console.log("member inserted");
    try {
      const data = await this.FindGroupMemberList(body, res);
      console.log("member inserted successfully");
      await this.getOwsGetsDetail(body.groupID, res, data);
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

  FindGroupMemberList(body, res) {
    return new Promise((resolve, reject) => {
      let memberlist = [];
      let transactionList = [];
      if (body.groupMember.length > 0) {
        body.groupMember.map((member) => {
          if (member.Accepted) memberlist.push(member);
        });
      }
      if (memberlist.length > 0) {
        var ows = body.amount / memberlist.length;
        for (let value of memberlist) {
          if (value.ID != body.memberID) {
            let transaction = {
              GroupID: body.groupID,
              MemberPaid: body.memberID,
              MemberOws: value.ID,
              Amount: ows,
            };
            transactionList.push(transaction);
            new UserTransactionBasedOnGroup(transaction).save(
              (error, result) => {
                if (error) {
                  reject(error);
                }
              }
            );
          }
        }
        let data = {
          memberInfo: memberlist,
          transactionList: transactionList,
        };
        resolve(data);
      }
    });
  }

  insert_Promise(body, res) {
    var insTransaction = new TransactionModel({
      TransactionDetail: body.transactionDetail,
      MemberID: body.memberID,
      GroupID: body.groupID,
      Amount: body.amount,
      SettleWith: "",
    });
    insTransaction.save((error, data) => {
      if (error) {
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });
        res.end();
      }
    });
  }

  getOwsGetsDetail(groupName, res, data) {
    let transactionlist = [];
    if (data.transactionList.length > 0) {
      if (data.memberInfo.length > 0) {
        for (let member1 = 0; member1 < data.memberInfo.length; member1++) {
          for (
            let member2 = member1 + 1;
            member2 < data.memberInfo.length;
            member2++
          ) {
            let member1ToMember2TransList = data.transactionList.filter(
              (x) =>
                x.MemberPaid == data.memberInfo[member1].ID &&
                x.MemberOws == data.memberInfo[member2].ID
            );
            let member1GetsFromMember2 = 0;
            let member2GetsFromMember1 = 0;
            if (member1ToMember2TransList.length > 0) {
              member1ToMember2TransList.forEach((element) => {
                member1GetsFromMember2 += element.Amount;
              });
            }

            let member2ToMember1TransList = data.transactionList.filter(
              (x) =>
                x.MemberPaid == data.memberInfo[member2].ID &&
                x.MemberOws == data.memberInfo[member1].ID
            );
            if (member2ToMember1TransList.length > 0) {
              member2ToMember1TransList.forEach((element) => {
                member2GetsFromMember1 += element.Amount;
              });
            }
            let finalValue = member1GetsFromMember2 - member2GetsFromMember1;
            transactionlist.push({
              MemberPaid: data.memberInfo[member1].ID,
              MemberOws: data.memberInfo[member2].ID,
              Amount: finalValue,
              MemberGetsName: data.memberInfo[member1].Name,
              MemberOwsName: data.memberInfo[member2].Name,
              MemberProfilePicGets: data.memberInfo[member1].UserProfilePic,
              MemberProfilePicOws: data.memberInfo[member2].UserProfilePic,
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

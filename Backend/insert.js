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
    try {
      const result = await this.insert_Promise(body, res);
      const data = await this.FindGroupMemberList(body, res, result);
      console.log("member inserted successfully");
      const success = await this.getOwsGetsDetail(body.groupID, res, data);
      if (success) {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end();
      }
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

  FindGroupMemberList(body, res, trans_ID) {
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
              TransactionID: trans_ID,
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
    return new Promise((resolve, reject) => {
      var insTransaction = new TransactionModel({
        TransactionDetail: body.transactionDetail,
        MemberID: body.memberID,
        GroupID: body.groupID,
        Amount: body.amount,
        SettleWith: "",
      });
      insTransaction.save((error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(insTransaction._id);
        }
      });
    });
  }

  getOwsGetsDetail(groupID, res, data) {
    return new Promise((resolve, reject) => {
      let transactionlist = [];
      UserTransactionBasedOnGroup.find({ GroupID: groupID }).then((result) => {
        let transactionList = JSON.parse(JSON.stringify(result));
        if (transactionList.length > 0) {
          if (data.memberInfo.length > 0) {
            for (let member1 = 0; member1 < data.memberInfo.length; member1++) {
              for (
                let member2 = member1 + 1;
                member2 < data.memberInfo.length;
                member2++
              ) {
                let member1ToMember2TransList = transactionList.filter(
                  (x) =>
                    x.MemberPaid == data.memberInfo[member1].ID._id &&
                    x.MemberOws == data.memberInfo[member2].ID._id
                );
                let member1GetsFromMember2 = 0;
                let member2GetsFromMember1 = 0;
                if (member1ToMember2TransList.length > 0) {
                  member1ToMember2TransList.forEach((element) => {
                    member1GetsFromMember2 += element.Amount;
                  });
                }

                let member2ToMember1TransList = transactionList.filter(
                  (x) =>
                    x.MemberPaid == data.memberInfo[member2].ID._id &&
                    x.MemberOws == data.memberInfo[member1].ID._id
                );
                if (member2ToMember1TransList.length > 0) {
                  member2ToMember1TransList.forEach((element) => {
                    member2GetsFromMember1 += element.Amount;
                  });
                }
                let finalValue =
                  member1GetsFromMember2 - member2GetsFromMember1;
                transactionlist.push({
                  MemberGets: data.memberInfo[member1].ID._id,
                  MemberOws: data.memberInfo[member2].ID._id,
                  GroupID: groupID,
                  Amount: finalValue,
                });
              }
            }
          }
          console.log(JSON.stringify(transactionlist));
          OwsGetsDetail.deleteMany({ GroupID: groupID }, (err, result) => {
            if (err) {
              reject(error);
            }
          });
          OwsGetsDetail.insertMany(transactionlist, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        }
      });
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

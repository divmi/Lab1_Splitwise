const TransactionModel = require("../Model/TransactionDetailModel");
const UserTransactionBasedOnGroup = require("../Model/UserTransactionBasedOnGroupModel");
const GroupInfo = require("../Model/GroupInfoModel");
const OwsGetsDetail = require("../Model/OwsGetsDetailModel");

const insert_TransactionForUserAndGroup = async args => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await insert_Promise(args);
      const memberName = await getGroupMemberName(args.groupID);
      const data = await FindGroupMemberList(args, result, memberName);
      console.log("member inserted successfully");
      const success = await getOwsGetsDetail(args.groupID, data);
      if (success) {
        resolve({ status: 200 });
      }
    } catch (e) {
      resolve({ status: 500 });
    }
  });
};

function getGroupMemberName(groupID) {
  return new Promise(async (resolve, reject) => {
    GroupInfo.find({ _id: groupID }).then(memberName => {
      let memberList = JSON.parse(JSON.stringify(memberName));
      resolve(memberList[0].GroupMemberInfo);
    });
  });
}

function FindGroupMemberList(body, trans_ID, memberName) {
  return new Promise((resolve, reject) => {
    let memberlist = [];
    let transactionList = [];
    if (memberName.length > 0) {
      memberName.map(member => {
        if (member.Accepted) memberlist.push(member);
      });
    }
    let count = 1;
    if (memberlist.length > 0) {
      var ows = body.amount / memberlist.length;
      for (let value of memberlist) {
        if (value.ID._id != body.memberID) {
          let transaction = {
            TransactionID: trans_ID,
            GroupID: body.groupID,
            MemberGets: body.memberID,
            MemberOws: value.ID,
            Amount: ows
          };
          transactionList.push(transaction);
          new UserTransactionBasedOnGroup(transaction).save((error, result) => {
            if (error) {
              reject(error);
            } else {
              if (count == memberlist.length - 1) resolve(memberlist);
              else {
                console.log("Came here");
                count++;
              }
            }
          });
        }
      }
    }
  });
}

function insert_Promise(body) {
  return new Promise((resolve, reject) => {
    var insTransaction = new TransactionModel({
      TransactionDetail: body.transactionDetail,
      MemberID: body.memberID,
      GroupID: body.groupID,
      Amount: body.amount,
      SettleWith: ""
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

async function getOwsGetsDetail(groupID, memberInfo) {
  return new Promise((resolve, reject) => {
    let transactionlist = [];
    UserTransactionBasedOnGroup.find({ GroupID: groupID }).then(result => {
      let transaction = JSON.parse(JSON.stringify(result));
      if (transaction.length > 0) {
        if (memberInfo.length > 0) {
          for (let member1 = 0; member1 < memberInfo.length; member1++) {
            for (
              let member2 = member1 + 1;
              member2 < memberInfo.length;
              member2++
            ) {
              let member1ToMember2TransList = transaction.filter(
                x =>
                  x.MemberGets == memberInfo[member1].ID &&
                  x.MemberOws == memberInfo[member2].ID
              );
              let member1GetsFromMember2 = 0;
              let member2GetsFromMember1 = 0;
              if (member1ToMember2TransList.length > 0) {
                member1ToMember2TransList.forEach(element => {
                  member1GetsFromMember2 += element.Amount;
                });
              }

              let member2ToMember1TransList = transaction.filter(
                x =>
                  x.MemberGets == memberInfo[member2].ID &&
                  x.MemberOws == memberInfo[member1].ID
              );
              if (member2ToMember1TransList.length > 0) {
                member2ToMember1TransList.forEach(element => {
                  member2GetsFromMember1 += element.Amount;
                });
              }
              let finalValue = member1GetsFromMember2 - member2GetsFromMember1;
              transactionlist.push({
                MemberGets: memberInfo[member1].ID,
                MemberOws: memberInfo[member2].ID,
                GroupID: groupID,
                Amount: finalValue
              });
            }
          }
        }
        console.log(JSON.stringify(transactionlist));
        OwsGetsDetail.deleteMany({ GroupID: groupID }, (err, result) => {
          if (err) {
            reject(error);
          } else {
            OwsGetsDetail.insertMany(transactionlist, (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            });
          }
        });
      }
    });
  });
}

exports.insert_TransactionForUserAndGroup = insert_TransactionForUserAndGroup;
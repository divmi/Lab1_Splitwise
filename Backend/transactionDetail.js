const GroupInfo = require("./Model/GroupInfoModel");
const OwsGetsDetail = require("./Model/OwsGetsDetailModel");
class transactionDetail {
  groupJoinRequest(body, res) {
    const query = { _id: body.name._id, "GroupMemberInfo.ID": body.id };
    const updateDocument = {
      $set: { "GroupMemberInfo.$.Accepted": true },
    };
    GroupInfo.updateOne(query, updateDocument, (error, success) => {
      if (error) {
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });
        res.end();
      } else {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end();
      }
    });
  }

  getUserSpecificGetOwsInfo(con, email, res) {
    // var sql =
    //   "SELECT * FROM SplitwiseDB.OwsGetsDetail where  MemberGets='" +
    //   email +
    //   "'OR MemberOws='" +
    //   email +
    //   "'";
    // con.query(sql, function (err, result) {
    //   if (err) throw err;
    //   res.end(JSON.stringify(result));
    // });
  }

  getWhetherUserCanbeDeleted(con, query, res) {
    var sql =
      "SELECT * FROM SplitwiseDB.OwsGetsDetail where GroupName='" +
      query.groupName +
      "' and (MemberGets='" +
      query.email +
      "'OR MemberOws='" +
      query.email +
      "')";

    con.query(sql, function (err, result) {
      if (err) throw err;
      res.end(JSON.stringify(result));
    });
  }

  getGroupSummary(ID, res) {
    console.log("GroupID :" + ID);
    OwsGetsDetail.find({ GroupID: ID }, (error, result) => {
      if (error) {
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });
        res.end();
      } else {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end(JSON.stringify(result));
      }
    });
  }
}

module.exports = {
  transactionDetail,
};

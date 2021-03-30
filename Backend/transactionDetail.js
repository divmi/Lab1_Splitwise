const GroupInfo = require("./Model/GroupInfoModel");
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

  getGroupSummary(con, groupName, res) {
    // var sql =
    //   "SELECT * FROM SplitwiseDB.OwsGetsDetail where GroupName='" +
    //   groupName +
    //   "'";
    // con.query(sql, function (err, result) {
    //   if (err) throw err;
    //   //console.log("found record" + result);
    //   res.end(JSON.stringify(result));
    // });
  }
}

module.exports = {
  transactionDetail,
};

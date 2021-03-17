var mysql = require("mysql");

class transactionDetail {
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
      "SELECT * FROM SplitwiseDB.OwsGetsDetail where  MemberGets='" +
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

  getWhetherUserCanbeDeleted(con, query, res) {
    var sql =
      "SELECT * FROM SplitwiseDB.OwsGetsDetail where GroupName='" +
      query.groupName +
      "' and (MemberGets='" +
      query.email +
      "'OR MemberOws='" +
      query.email +
      "')";
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("found record" + result);
      res.end(JSON.stringify(result));
    });
  }

  getGroupSummary(con, groupName, res) {
    var sql =
      "SELECT * FROM SplitwiseDB.OwsGetsDetail where GroupName='" +
      groupName +
      "'";
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      //console.log("found record" + result);
      res.end(JSON.stringify(result));
    });
  }
}

module.exports = {
  transactionDetail,
};

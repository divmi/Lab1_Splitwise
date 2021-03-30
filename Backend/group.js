const Users = require("./Model/UserRegistrationModel");
const GroupInfo = require("./Model/GroupInfoModel");
var group = class group {
  getAllUser(res) {
    Users.find({}, (error, user) => {
      if (error) {
        res.writeHead(401, {
          "Content-Type": "text/plain",
        });
        res.end("Not able to read users");
      } else if (user) {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end(JSON.stringify(user));
      }
    });
  }

  getGroupDetail(ID, res) {
    console.log("Control came here :" + ID);
    GroupInfo.find({ "GroupMemberInfo.ID": { $all: ID } }, (error, grp) => {
      if (error) {
        res.writeHead(401, {
          "Content-Type": "text/plain",
        });
      } else if (grp) {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        console.log(JSON.stringify(grp));
        res.end(JSON.stringify(grp));
      }
    });
  }

  gettransactionDetail(ID, res) {
    console.log("Connected!");
    GroupInfo.find({ GroupID: ID }, (err, transaction) => {
      if (err) {
        res.writeHead(401, {
          "Content-Type": "text/plain",
        });
      } else if (transaction) {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        console.log(JSON.stringify(transaction));
        res.end(JSON.stringify(transaction));
      }
    });
  }

  getTransactionFromUser(con, email, res) {
    console.log("Connected!");
    var sql =
      "Select detail.*, userinfo.Name , userinfo.Currency from TransactionDetail as detail INNER JOIN UserRegistration " +
      "as userinfo ON (detail.MemberID=userinfo.Email) where GroupName In(Select GroupName " +
      "from GroupMemberInfo where MemberID='" +
      email +
      "') ORDER BY Time desc";
    console.log(sql);
    con.query(sql, function (err, result) {
      if (err) throw err;
      if (result) {
        res.writeHead(200, {
          "Content-Type": "text/plain",
        });
        res.end(JSON.stringify(result));
      } else {
        res.writeHead(401, {
          "Content-Type": "text/plain",
        });
        res.end("UnSuccessful Login");
      }
    });
  }
};

module.exports = {
  group,
};

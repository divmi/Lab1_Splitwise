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

  insert_TransactionForUserAndGroup(con, body, res) {
    const result = this.insert_Promise(con, body, res);
    con.query(
      "Select MemberID from GroupMemberInfo where GroupName ='" +
        body.groupname +
        "' and Accepted=true",
      function (err, memberInfo) {
        if (err) throw err;
        if (memberInfo.length > 0) {
          var ows = body.amount / memberInfo.length;
          for (let value of memberInfo) {
            if (value.MemberID != body.memberID) {
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
              con.query(insertDetail, function (err, result) {
                if (err) throw err;
              });
            }
          }
        }
      }
    );
  }

  async insert_Promise(con, body, res) {
    var insertDetail = "";
    var dataFromUserTransactionTable;
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
    console.log(insGroupLink + insGroupLink1);
    con.query(insGroupLink + insGroupLink1, function (err, result) {
      if (err) throw err;
      con.query(
        "Select MemberID from GroupMemberInfo where GroupName ='" +
          body.groupname +
          "' and Accepted=true",
        function (err, memberInfo) {
          if (err) throw err;
          if (memberInfo.length > 0) {
            var ows = body.amount / memberInfo.length;
            var gets = body.amount - ows;
            for (let value of memberInfo) {
              con.query(
                "Select * from UserTransactionDetail where GroupName ='" +
                  body.groupname +
                  "' and MemberID= '" +
                  value.MemberID +
                  "'",
                function (error, dataFromUserTransactionTable) {
                  if (error) throw error;
                  console.log(
                    "Data from db:" +
                      JSON.stringify(dataFromUserTransactionTable)
                  );
                  if (value.MemberID == body.memberID) {
                    if (dataFromUserTransactionTable.length == 0) {
                      insertDetail =
                        "INSERT INTO UserTransactionDetail ( MemberID, GroupName, ows,gets) VALUES (";
                      insertDetail =
                        insertDetail +
                        "'" +
                        value.MemberID +
                        "','" +
                        body.groupname +
                        "','" +
                        0 +
                        "','" +
                        gets +
                        "')";
                    } else {
                      if (dataFromUserTransactionTable.length > 0) {
                        var getValue = dataFromUserTransactionTable.find(
                          (x) => x.MemberID == value.MemberID
                        );
                        if (getValue) {
                          var new_gets = gets + getValue.gets;
                          insertDetail =
                            `Update UserTransactionDetail SET ows='` +
                            getValue.ows +
                            `', gets='` +
                            new_gets +
                            "'Where MemberID ='" +
                            value.MemberID +
                            "'";
                        }
                      }
                    }
                  } else {
                    if (dataFromUserTransactionTable.length == 0) {
                      insertDetail =
                        "INSERT INTO UserTransactionDetail ( MemberID, GroupName, ows,gets) VALUES (";
                      insertDetail =
                        insertDetail +
                        "'" +
                        value.MemberID +
                        "','" +
                        body.groupname +
                        "','" +
                        ows +
                        "','" +
                        0 +
                        "')";
                    } else {
                      var getValue = dataFromUserTransactionTable.find(
                        (x) => x.MemberID == value.MemberID
                      );
                      if (getValue) {
                        var new_ows = getValue.ows + ows;
                        insertDetail =
                          `Update UserTransactionDetail SET ows='` +
                          new_ows +
                          `', gets='` +
                          getValue.gets +
                          "' Where MemberID ='" +
                          value.MemberID +
                          "'";
                      }
                    }
                  }
                  console.log(insertDetail);
                  con.query(insertDetail, function (err, memberInfo) {
                    if (err) throw err;
                  });
                }
              );
            }

            // memberInfo.forEach((value) => {});
          }
        }
      );
      res.writeHead(200, {
        "Content-Type": "text/plain",
      });
      res.end(JSON.stringify(result));
    });
  }

  insertTransactionIntoMemberTable(con, memberInfo) {
    if (memberInfo.length > 0) {
      let ows = body.amount / memberInfo.length;
      let gets = body.amount - ows;
      console.log("-------------------------" + ows + "--------" + gets);
      const dataFromUserTransactionTable = con.query(
        "Select * from UserTransactionDetail where GroupName ='" +
          body.groupname +
          "'"
      );
      memberInfo.map((value) => {
        if (value.MemberID == body.memberID) {
          if (dataFromUserTransactionTable.length == 0) {
            memberTransactionQuery =
              "INSERT INTO UserTransactionDetail ( MemberID, GroupName, ows,gets) VALUES (";
            queryDetail =
              "'" +
              value.MemberID +
              "','" +
              body.groupname +
              "','" +
              0 +
              "','" +
              gets +
              "')";
          } else {
            var getValue = dataFromUserTransactionTable.find(
              (x) => x.MemberID == value.MemberID
            );
            if (getValue.length > 0) {
              var newgets = gets + getValue.gets;
              ows = getValue.ows;
              console.log(
                "-------------------------" + newows + "--------" + newgets
              );
              memberTransactionQuery =
                `Update UserTransactionDetail SET MemberID='` +
                value.MemberID +
                `', GroupName='` +
                body.groupname +
                `', ows='` +
                ows +
                `', gets='` +
                newgets;
            }
          }
        } else {
          if (dataFromUserTransactionTable.length == 0) {
            memberTransactionQuery =
              "INSERT INTO UserTransactionDetail ( MemberID, GroupName, ows,gets) VALUES (";
            queryDetail =
              "'" +
              value.MemberID +
              "','" +
              body.groupname +
              "','" +
              ows +
              "','" +
              0 +
              "')";
          } else {
            var getValue = dataFromUserTransactionTable.find(
              (x) => x.MemberID == value.MemberID
            );
            if (getValue.length > 0) {
              gets = getValue.gets;
              var newows = getValue.ows + ows;
              console.log(
                "-------------------------" + newows + "--------" + gets
              );
              memberTransactionQuery =
                `Update UserTransactionDetail SET MemberID='` +
                value.MemberID +
                `', GroupName='` +
                body.groupname +
                `', ows='` +
                newows +
                `', gets='` +
                gets;
            }
          }
        }
      });
      var runquery = con.query(memberTransactionQuery + queryDetail);
      return runquery;
    }
  }
}

module.exports = {
  insert,
};

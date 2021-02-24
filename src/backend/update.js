var mysql = require("mysql");
var update = class update {
  updateUserProfile(con, req, res) {
    var sql =
      `UPDATE 
      UserRegistration
      SET 
      Name = '` +
      req.body.name +
      `', 
      Email = '` +
      req.body.email +
      `',
      ContactNo = '` +
      req.body.contactNumber +
      `',
      Currency = '` +
      req.body.currency +
      `',
      Timezone = '` +
      req.body.timeZone +
      `',
      Language = '` +
      req.body.toYr;
    console.log(sql);
    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      console.log(JSON.stringify(result));
      res.end(JSON.stringify(result));
    });
  }
};

module.exports = {
  update,
};

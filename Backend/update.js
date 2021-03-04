var mysql = require("mysql");
var update = class update {
  updateUserProfile(con, req, res) {
    var sql =
      `UPDATE 
      UserRegistration
      SET 
      Name = '` +
      req.Name +
      `', 
      ContactNo = '` +
      req.ContactNo +
      `',
      Currency = '` +
      req.Currency +
      `',
      Timezone = '` +
      req.Timezone +
      `',
      Language = '` +
      req.Language +
      "'Where Email ='" +
      req.Email +
      "'";
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

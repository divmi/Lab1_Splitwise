var mysql=require('mysql');

var insert = class insert {
    insert_user(con, body, res) {
      console.log("Connected!");
      var sql =
        "INSERT INTO UserRegistration (Name, Password, Email) VALUES (";
      var sql1 =
        "'" +
        body.name +
        "','" +
        body.password +
        "','" +
        body.email +
        "')";
      console.log(sql + sql1);
      con.query(sql + sql1, function(err, result) {
        if (err) throw err;
        console.log("1 record inserted" + result);
        res.writeHead(200, {
          "Content-Type": "text/plain"
        }); 
        res.end(JSON.stringify(result));
      });
    }
}
  
  module.exports = {
    insert
  }; 

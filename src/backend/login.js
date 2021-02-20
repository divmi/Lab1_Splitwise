var mysql=require('mysql');

var login = class login {
     UserLogin(con, body, res) {
      console.log("Connected!");
      var sql =
        "Select * from UserRegistration where Email='"+body.email +"'and Password='"+ body.password+"'";
      console.log(sql);
      con.query(sql, function(err, result) {
        if (err) throw err;
        console.log("the record is " + result);
        pass = result[0].Password;
        email = result[0].Email;

      if (pass === body.password) {
        res.cookie("cookie", email);
        console.log(res.cookie("cookie", email));

        res.writeHead(200, {
          "Content-Type": "text/plain"
        });

        res.end(JSON.stringify(result));
      } else {
        res.writeHead(401, {
          "Content-Type": "text/plain"
        });
        res.end("UnSuccessful Login");
      }
    });
    }
}
  
  module.exports = {
    login
  }; 

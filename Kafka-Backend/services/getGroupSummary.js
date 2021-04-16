const OwsGetsDetail = require("../Model/OwsGetsDetailModel");

function handle_request(ID, callback) {
  console.log("Inside book kafka backend");
  OwsGetsDetail.find({ GroupID: ID }, (error, result) => {
    if (error) {
      res.writeHead(500, {
        "Content-Type": "text/plain"
      });
      res.end();
    } else {
      res.writeHead(200, {
        "Content-Type": "text/plain"
      });
      res.end(JSON.stringify(result));
    }
  });
}

exports.handle_request = handle_request;

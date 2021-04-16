const OwsGetsDetail = require("../Model/OwsGetsDetailModel");

function handle_request(ID, callback) {
  console.log("Inside book kafka backend");
  OwsGetsDetail.find({ GroupID: ID }, (error, result) => {
    if (error) {
      callback(error, "Error");
    } else {
      callback(null, result);
    }
  });
}

exports.handle_request = handle_request;

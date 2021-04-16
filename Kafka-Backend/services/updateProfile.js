const Users = require("../Model/UserRegistrationModel");

function handle_request(req, callback) {
  console.log("Update Group Request Handled");
  const filter = { _id: req._id };
  const updateDoc = {
    $set: {
      Name: req.Name,
      ContactNo: req.ContactNo,
      Currency: req.Currency,
      Timezone: req.Timezone,
      Language: req.Language,
      UserProfilePic: req.UserProfilePic
    }
  };
  Users.updateOne(filter, updateDoc, (error, result) => {
    if (error) {
      callback(error, "Error");
    } else {
      callback(null, result);
    }
  });
}

exports.handle_request = handle_request;

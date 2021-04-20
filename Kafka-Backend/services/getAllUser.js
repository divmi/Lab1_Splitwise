const Users = require("../Model/UserRegistrationModel");

function handle_request(searchName, callback) {
  console.log("Update Group Request Handled");
  if (searchName.Name != null && searchName.Name.length > 0) {
    Users.find(
      { Name: { $regex: searchName.Name, $options: "i" } },
      { Name: 1, Email: 1 },
      (error, user) => {
        if (error) {
          callback(error, "Error");
        } else if (user) {
          callback(null, user);
        }
      }
    );
  } else if (searchName.Email != null && searchName.Email.length > 0) {
    Users.find(
      { Email: { $regex: searchName.Email, $options: "i" } },
      { Name: 1, Email: 1 },
      (error, user) => {
        if (error) {
          callback(error, "Error");
        } else if (user) {
          callback(null, user);
        }
      }
    );
  }
}

exports.handle_request = handle_request;

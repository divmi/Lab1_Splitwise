const OwsGetsDetail = require("../Model/OwsGetsDetailModel");

function handle_request(ID, callback) {
  console.log("Inside book kafka backend");
  console.log(body._id);
  OwsGetsDetail.find({ $or: [{ MemberGets: ID }, { MemberOws: ID }] })
    .populate("MemberGets", ["Name", "UserProfilePic"])
    .populate("MemberOws", ["Name", "UserProfilePic"])
    .populate("GroupID", ["GroupName"])
    .then(result => {
      callback(null, result);
      //   console.log(JSON.stringify(result));
      //   res.writeHead(200, {
      //     "Content-Type": "text/plain"
      //   });
      //   res.end(JSON.stringify(result));
    });
}

exports.handle_request = handle_request;

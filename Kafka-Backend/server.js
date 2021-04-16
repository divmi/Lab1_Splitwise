var connection = new require("./kafka/Connection");
const Database = require("./config");

var createGroup = require("../Kafka-Backend/services/createGroup");
var updateGroup = require("../Kafka-Backend/services/updateGroup");
var joinGroup = require("../Kafka-Backend/services/joinGroup");
var updateProfile = require("../Kafka-Backend/services/updateProfile");

var addComment = require("../Kafka-Backend/services/addComment");
var deleteComment = require("../Kafka-Backend/services/deleteComment");
var getCommentForTransaction = require("../Kafka-Backend/services/getCommentForTransaction");
var getCurrentUserGroup = require("../Kafka-Backend/services/getCurrentUserGroup");
var getGroupNotification = require("../Kafka-Backend/services/getGroupNotification");
var getGroupSummary = require("../Kafka-Backend/services/getGroupSummary");
var getTransactionFromUser = require("../Kafka-Backend/services/getTransactionFromUser");
var getTransactionInfo = require("../Kafka-Backend/services/getTransactionInfo");
var getUserSpecificGetOwsInfo = require("../Kafka-Backend/services/getUserSpecificGetOwsInfo");
var insertGroupTransaction = require("../Kafka-Backend/services/insertGroupTransaction");
var settleUp = require("../Kafka-Backend/services/settleUp");

function handleTopicRequest(topic_name, fname) {
  //var topic_name = 'root_topic';
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();
  console.log("server is running ");
  consumer.on("message", function (message) {
    console.log("message received for " + topic_name + " ", fname);
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);

    fname.handle_request(data.data, function (err, res) {
      console.log("after handle" + res);
      var payloads = [
        {
          topic: data.replyTo,
          messages: JSON.stringify({
            correlationId: data.correlationId,
            data: res
          }),
          partition: 0
        }
      ];
      producer.send(payloads, function (err, data) {
        console.log(data);
      });
      return;
    });
  });
}

// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("createGroup", createGroup);
handleTopicRequest("updateGroup", updateGroup);
handleTopicRequest("joinGroup", joinGroup);
handleTopicRequest("updateProfile", updateProfile);

handleTopicRequest("addComment", addComment);
handleTopicRequest("deleteComment", deleteComment);
handleTopicRequest("getCommentForTransaction", getCommentForTransaction);
handleTopicRequest("getCurrentUserGroup", getCurrentUserGroup);
handleTopicRequest("getGroupNotification", getGroupNotification);
handleTopicRequest("getGroupSummary", getGroupSummary);
handleTopicRequest("getTransactionFromUser", getTransactionFromUser);
handleTopicRequest("getTransactionInfo", getTransactionInfo);
handleTopicRequest("getUserSpecificGetOwsInfo", getUserSpecificGetOwsInfo);
handleTopicRequest("insertGroupTransaction", insertGroupTransaction);
handleTopicRequest("settleUp", settleUp);

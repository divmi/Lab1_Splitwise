const express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const app = express();
const port = 8000;
const ipAddress = "localhost";

const { mongoDB } = require("./Utils/config");
const mongoose = require("mongoose");

app.use(express.static("uploads"));
const multer = require("multer"); //upload image on server

//require express session
var session = require("express-session");
app.use(bodyParser.urlencoded({ extended: true }));
//use session to store user data between HTTP requests
app.use(
  session({
    secret: "cmpe273_kafka_passport_mongo",
    resave: false,
    saveUninitialized: true,
    duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000,
  })
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
  "file"
);
const insert = require("./insert");
const group = require("./group");
const Update = require("./update");
var con = "";

const transaction = require("./transactionDetail");

app.set("view engine", "ejs");

var options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 500,
  bufferMaxEntries: 0,
};

mongoose.connect(mongoDB, options, (err, res) => {
  if (err) {
    console.log(err);
    console.log(`MongoDB Connection Failed`);
  } else {
    console.log(`MongoDB Connected`);
  }
});

//use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: `http://${ipAddress}:3000`,
    credentials: true,
  })
);
app.use(bodyParser.json());
//Allow Access Control
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", `http://${ipAddress}:3000`);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});

const Login = require("./routes/Login");
app.use("/login", Login);

app.listen(port, () => {
  console.log("App is listening to 8000");
});

// app.post("/signupUser", function (req, res) {
//   var ins = new insert.insert();
//   ins.insert_user(req.body, res);
// });

app.post("/upload", (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      res.sendStatus(500);
    }
    res.send(req.file.filename);
  });
});

app.post("/createGroup", function (req, res) {
  console.log("Req Body : ", req.body);
  var insgrp = new insert.insert();
  insgrp.insert_Group(req.body, res);
});

app.get("/getCurrentUserGroup/", function (req, res) {
  var userDetail = new group.group();
  userDetail.getGroupDetail(req.query.ID, res);
});

app.post("/updateProfile", function (req, res) {
  var update = new Update.update();
  update.updateUserProfile(req.body, res);
});

app.post("/updateGroup", function (req, res) {
  var update = new Update.update();
  update.updateGroup(req.body, res);
});

app.post("/joinedGroup", function (req, res) {
  var trans = new transaction.transactionDetail();
  trans.groupJoinRequest(req.body, res);
});

app.post("/settleUp", function (req, res) {
  console.log("Req Body settleUp: ", req.body);
  var insertSettleUp = new insert.insert();
  insertSettleUp.settleUp(req.body, res);
});

app.post("/insertGroupTransaction", function (req, res) {
  console.log("Req Body insertGroupTransaction: ", req.body);
  var insertTransaction = new insert.insert();
  insertTransaction.insert_TransactionForUserAndGroup(req.body, res);
});

app.get("/getTransactionInfo", function (req, res) {
  var userDetail = new group.group();
  userDetail.gettransactionDetail(req.query.ID, res);
});

app.get("/getTransactionFromUser", function (req, res) {
  var userDetail = new group.group();
  userDetail.getTransactionFromUser(req.query.ID, res);
});

app.get("/getGroupNotification", function (req, res) {
  var userDetail = new group.group();
  userDetail.getGroupNotification(req.query.memberID, res);
});

app.get("/getAllUser", function (req, res) {
  var user = new group.group();
  user.getAllUser(res);
});

app.get("/getUserSpecificGetOwsInfo", function (req, res) {
  console.log("Req Body getUserSpecificGetOwsInfo: ", req.query.ID);
  var tdetail = new transaction.transactionDetail();
  tdetail.getUserSpecificGetOwsInfo(req.query.ID, res);
});

// app.get("/getUserCanBeDeleted", function (req, res) {
//   console.log("Req Body getUserCanBeDeleted: ", req.query);
//   var tdetail = new transaction.transactionDetail();
//   tdetail.getWhetherUserCanbeDeleted(con, req.query, res);
// });

app.get("/getGroupSummary", function (req, res) {
  var tdetail = new transaction.transactionDetail();
  tdetail.getGroupSummary(req.query.ID, res);
});

module.exports = app;

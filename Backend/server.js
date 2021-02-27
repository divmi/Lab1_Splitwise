const express = require("express");
const mysql = require("mysql");
var cors = require("cors");
var bodyParser = require("body-parser");
const app = express();
const port = 8000;

app.use("/group_pic", express.static("public/assets"));

const multer = require("multer"); //upload image on server

//require express session
var session = require("express-session");
var cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({ extended: true }));
//use cookie parser to parse request headers
app.use(cookieParser());
//use session to store user data between HTTP requests
app.use(
  session({
    secret: "SplitwiseSecretString",
    resave: false,
    saveUninitialized: true,
  })
);

const storage = multer.diskStorage({
  destination: "./../public/upload/",
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, `${new Date()}-${file.fieldname}.${file.mimetype.split("/")[1]}`); //`${new Date()}-${file.fieldname}.${file.mimetype.split("/")[1]}`
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage });
const insert = require("./insert");
const login = require("./login");
const group = require("./group");
const Update = require("./update");

app.set("view engine", "ejs");
const con = mysql.createConnection({
  host: "splitwise.c5rygpr3lt0j.us-west-1.rds.amazonaws.com",
  user: "admin",
  password: "splitwise",
  database: "SplitwiseDB",
});

//use cors to allow cross origin resource sharing
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());
//Allow Access Control
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
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

app.listen(port, () => {
  console.log("App is listening to 8000");
});

app.get("/api/UserRegistration", (req, res) => {
  con.query(`select * from UserRegistration`, (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
      console.log(rows);
    }
  });
});

app.post("/signupUser", function (req, res) {
  console.log("Req Body : ", req.body);
  var ins = new insert.insert();
  console.log("Divya :" + req.body.name);
  ins.insert_user(con, req.body, res);
});

app.post("/upload", upload.single("file"), (req, res, next) => {
  console.log("Req Body : ", req.body);
  res.writeHead(200, {
    "Content-Type": "application/json",
  });
  res.end(`${new Date()}-${req.body.name}`);
});

app.post("/createGroup", function (req, res) {
  console.log("Req Body : ", req.body);
  console.log("Divya 11111:" + req.body.name);
  var insgrp = new insert.insert();
  insgrp.insert_Group(con, req.body, res);
});

app.get("/signupUser", function (req, res) {
  console.log("Req Body : ", req.body);
});

//Route to handle Post Request Call
app.post("/loginUser", function (req, res) {
  console.log("Req Body : ", req.body);
  var loginUser = new login.login();
  loginUser.UserLogin(con, req.body, res);
});

app.get("/getCurrentUserGroup", function (req, res) {
  console.log("Req Body : ", req.query.email);
  var userDetail = new group.group();
  userDetail.getGroupDetail(con, req.query.email, res);
});

app.post("/updateProfile", function (req, res) {
  console.log("Req Body : ", req.body);
  var update = new Update.update();
  update.updateUserProfile(con, req.body, res);
});

app.get("/getUserInfo", function (req, res) {
  console.log("Req Body : ", req.query.userEmail);
  var userDetail = new group.group();
  userDetail.getUserDetail(con, req.query.userEmail, res);
});

app.get("/getAllUser", function (req, res) {
  var user = new group.group();
  user.getAllUser(con, req, res);
});

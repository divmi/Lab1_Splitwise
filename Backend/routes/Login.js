"use strict";
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { secret } = require("../Utils/config");
const Users = require("../Model/UserRegistrationModel");
const { auth } = require("../Utils/passport");
const bcrypt = require("bcrypt");
auth();

//Route to handle Post Request Call
router.post("/loginUser", (req, res) => {
  Users.findOne({ Email: req.body.email }, (error, user) => {
    if (error) {
      res.writeHead(500, {
        "Content-Type": "text/plain",
      });
      res.end();
    }
    if (user) {
      bcrypt.compare(
        req.body.password,
        user.Password,
        function (err, matchPassword) {
          if (err) return error;
          if (matchPassword) {
            const token = createToken(user);
            const userData = {
              _id: user._id,
              Name: user.Name,
              Email: user.Email,
              Currency: user.Currency,
              Timezone: user.Timezone,
              Language: user.Language,
              ContactNo: user.ContactNo,
              UserProfilePic: user.UserProfilePic,
              token: token,
            };
            res.writeHead(200, {
              "Content-Type": "text/plain",
            });
            res.end(JSON.stringify(userData));
          } else {
            res.writeHead(401, {
              "Content-Type": "text/plain",
            });
            res.end("UnSuccessful Login");
          }
        }
      );
    } else {
      res.writeHead(401, {
        "Content-Type": "text/plain",
      });
      res.end("UnSuccessful Login");
    }
  });
});

router.post("/signupUser", async (req, res) => {
  let body = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    body.password = await bcrypt.hash(body.password, salt);
    Users.findOne({ Email: body.email }, (error, user) => {
      if (error) {
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });
        res.end("User is already registered");
      }
      if (user) {
        res.writeHead(400, {
          "Content-Type": "text/plain",
        });
        res.end("User is already registered");
      } else {
        console.log("Registering New User");
        const newUser = {
          Name: body.name,
          Email: body.email,
          Password: body.password,
          Currency: "$",
          Timezone: "(GMT-08:00) Pacific Time",
          Language: "English",
          ContactNo: "9999999999",
          UserProfilePic: "",
        };
        new Users(newUser).save((error, data) => {
          if (error) {
            console.log(error);
            res.writeHead(500, {
              "Content-Type": "text/plain",
            });
            res.end();
          } else {
            const token = createToken(newUser);
            newUser.token = token;
            newUser._id = data._id;
            newUser.Password = "";
            console.log(newUser);
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(JSON.stringify(newUser));
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

function createToken(user) {
  const payload = { id: user._id };
  const token = jwt.sign(payload, secret, {
    expiresIn: 1008000,
  });
  return "JWT " + token;
}

module.exports = router;

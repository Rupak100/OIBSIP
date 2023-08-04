const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require("mongoose");
var encrypt = require("mongoose-encryption");
const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// <--------------------- DATABASE --------------------------------------------------------------->
mongoose.connect("mongodb://127.0.0.1:27017/secretsDB");
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const secret = "ILoveMyCountryVeryMuch";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });
const List = new mongoose.model("List", userSchema);
app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});
app.get("/submit", function (req, res) {
  res.render("submit");
});
app.post("/register", function (req, res) {
  console.log(req.body.username); const postContent = new List({
    username: req.body.username,
    password: req.body.password,
  });
  postContent.save().then(res.render("home")).catch(function (err) {
    console.log(err);
  }

  );


})
app.post("/login", function (req, res) {
  const usernam = req.body.username;
  const password = req.body.password;
  List.findOne({ username: usernam }).then(function (id) {
    if (id.password === password) {
      res.render("secrets");
    }
    else {
      console.error('an error occurred');
    }
  }).catch(function (err) {
    console.log(err);
  })
})
app.listen(3000, function (req, res) {
  console.log("server started at port 3000");
});

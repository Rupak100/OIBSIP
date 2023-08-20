const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require("mongoose");
// var encrypt = require("mongoose-encryption");
// const md5=require("?md5");
const passport=require("passport");
const session=require("express-session");
const passportLocalMongoose=require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate')

const app = express();
// this line for adding css
app.use(express.static("public"));
//code for adding ejs file
app.set('view engine', 'ejs');
//for adding .env file
require('dotenv').config();
//for bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//below code for passport.JS session and having secret code 

app.use(session({
  secret:" i loved a girl to whom i never expressed",
  resave:false,
  saveUninitialized:false
}));

app.use(passport.initialize());

app.use(passport.session());

// <--------------------- DATABASE --------------------------------------------------------------->
mongoose.connect("mongodb://127.0.0.1:27017/secretsDB");
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleId:String,
  secret:String
});

const secret = process.env.secret;
//userSechema will use passport-Local-Mongoose as a plugin :
userSchema.plugin(passportLocalMongoose); 
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);
//passport.jS will create local login strategy:
passport.use(User.createStrategy()); 
//serialize and deserialize the user:
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/secrets",
  userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
},
function(accessToken, refreshToken, profile, cb) {
  //console.log(profile);
  User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}
));


app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

  app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });

app.get("/", function (req, res) {
  res.render("home");
});
app.get("/submit", function (req, res) {
  res.render("submit");
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
app.get("/secrets", (req, res) => {
  //the below code is to find all the user who have the secret value as not null and than rendering the page secret 
  User.find({"secret":{$ne:null}}).then(function (foundUser) { 
    res.render("secrets",{userSecrets:foundUser})
   }).catch(function (err) {
    console.log(err);
     });
});

app.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.post("/submit", (req, res) => {

  //to storing the secret to the const
  const userSecret = req.body.secret;
  console.log(req.user._id);
  //by using id we target the specific person and save to db and redirect to secret page
  User.findById(req.user._id).then(function (userid) {
    userid.secret = userSecret;
    userid
      .save()
      .then(res.redirect("/secrets"))
      .catch(function (err) {
        console.log(err);
      });
  }).catch(function (err) {console.log(err);  });





});


app.post("/register", function (req, res) {
 
User.register({username:req.body.username},req.body.password,function (err,user) {
  if(err){
  console.log(err);

  res.redirect("/register");
  }
  else{
    passport.authenticate("local")(req,res,function () {
          res.redirect("/secrets");
        });
      }
    });

  
});


app.post("/login", function (req, res) {
   const user = new User({
     username: req.body.username,
     password: req.body.password,
   });
   req.login(user, function(err) {
    if (err) {console.log(err); }
       passport.authenticate("local")(req,res,function () {
      res.redirect("/secrets");
    });
  });
});
 app.listen(3000, function (req, res) {
   console.log("server started at port 3000");
 });

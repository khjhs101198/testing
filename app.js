const express = require("express");
const app = express();
const urlencoded = express.urlencoded({extended: false});
const jsonParser = express.json();
const cookieParser = require("cookie-parser");
const filter = require("./public/scripts/filter");

app.set("view engine", "ejs");
app.use(urlencoded, jsonParser, cookieParser());
app.use(express.static("./public"));
app.use(function addCookie(req, res, next){
  if(!req.cookies.userID){ // if no user data cookie
    res.set("Set-Cookie", "userID=123; SameSite=None; Secure");
  }
  if(!req.cookies.viewHis) {
    res.cookie("viewHis", "ct0", {sameSite: "None" ,secure: true, path: "/cookies", httpOnly: true, maxAge: "86400"});
  }
  next();
});

app.get("/", function(req, res){
  res.render("main");
});

// get user profile from cookie
app.get("/cookies/outerInf", function(req, res){
  if(Number( req.cookies.viewHis.match(`(?<=ct)[0-9]*`) )===0) {
    res.sendFile(__dirname+"/public/images/w18.jpg"); // Default images
  }
  else {
    res.sendFile(__dirname+`/public/images/${filter(req.cookies.viewHis)}.png`)
  }
});

app.put("/cookies/modifyCookie", function(req, res) {
  let cc = req.cookies.viewHis;
  let curCount = Number( cc.match(`(?<=ct)[0-9]*`) );
  if(curCount<10) {
    res.cookie("viewHis", `${cc.replace( new RegExp("(?<=ct)[0-9]*"), curCount+1)}${req.body.type}1`, {sameSite: "None" ,secure: true, path: "/cookies", httpOnly: true});
  }
  else {
    res.cookie("viewHis", `${cc.replace( new RegExp("ct10[A-Z,a-z]*1"), "ct10")}${req.body.type}1`, {sameSite: "None" ,secure: true, path: "/cookies", httpOnly: true})
  }
  res.send("Modify cookies successfully!");
});

app.listen(process.env.PORT||5000, function(err){
  if(err) throw err;
  console.log("Sever started");
});

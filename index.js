var express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressEdge = require("express-edge");

mongoose.connect("mongodb://localhost:27017/gfg", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error"));
db.once("open", function(callback) {
  console.log("connection succeeded");
});

var app = express();
app.use(expressEdge.engine);
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.post("/sign_up", function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var pass = req.body.password;
  var bal = req.body.bal;

  var data = {
    name: name,
    email: email,
    password: pass,
    bal: bal
  };
  db.collection("details").insertOne(data, function(err, collection) {
    if (err) throw err;
    console.log("Record inserted Successfully");
  });
  res.render("signin");
});

app.get("/", function(req, res) {
  res.render("signup");
});

app.get("/signin", function(req, res) {
  res.render("signin");
});

app.post("/user", async function(req, res) {
  const email = req.body.email;
  const pass = req.body.password;
  const User = await db.collection("details").findOne({ email: email });
  if (User.password == pass) {
    //   res.setHeader("Content-Type", "text/html");
    //   res.redirect("/signin");
    // window.location.href = "http://localhost:3000/signin";
    res.render("user", {
      User
    });
  }
});

app.post("/transfer", async function(req, res) {
  const from = req.body.from;
  const to = req.body.to;
  const amount = req.body.amount;
  console.log(from);
  const fromUser = await db.collection("details").findOne({ email: from });
  const toUser = await db.collection("details").findOne({ email: to });

  //console.log(fromUser);
  // if (fromUser.password == pass) {
  //   //   res.setHeader("Content-Type", "text/html");
  //   //   res.redirect("/signin");
  //   // window.location.href = "http://localhost:3000/signin";
  //   res.render("user", {
  //     User
  //   });
  //}
  res.render("transfer");
});

app.listen(3000, () => {
  console.log("App listening on port 3000");
});

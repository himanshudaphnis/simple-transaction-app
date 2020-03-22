var express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const expressEdge = require("express-edge");

mongoose
  .connect("mongodb://localhost:27017/gfg", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(console.log("connected"))
  .catch(console.log("Not connected"));
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
  var phone = req.body.phone;

  var data = {
    name: name,
    email: email,
    password: pass,
    phone: phone
  };
  db.collection("details").insertOne(data, function(err, collection) {
    if (err) throw err;
    console.log("Record inserted Successfully");
  });

  res.render("signup_success");
});

app.get("/", function(req, res) {
  // res.set({
  //   "Access-control-Allow-Origin": "*"
  // });
  // return res.redirect("index.html");
  res.render("index");
});

app.listen(3000, () => {
  console.log("App listening on port 3000");
});

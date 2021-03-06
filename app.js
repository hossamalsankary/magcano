// Import Libraries
const express = require("express"),
app = express();
const path = require('path');
//Initializing Importint Modules
require("dotenv").config();
require("express-async-errors");
var morgan = require("morgan");
//set ejs
app.set("view engine", "ejs");

//Import Custom Modules
const updataAsyncData = require("./serves/updataeverything"),
  { connectDB } = require("./db/connect"),
  auth = require("./routes/auth"),
  event = require("./routes/event"),
  notFoundMiddleware = require("./middleware/not-found"),
  errorHandlerMiddleware = require("./middleware/error-handler"),
  config = require("./configure/config"),
  bodyParser = require("body-parser");

//Careate New Express applications and Configure It
app.use(express.json());
app.use(express.urlencoded());
app.use( express.static(path.join( __dirname, 'flags')));

//Route For UI
// Those Route Just for Testing My API
app.get("/", function (req, res) {
  res.render("pages/main");
});
app.get("/singin", function (req, res) {
  res.render("pages/singin");
});
app.get("/main", function (req, res) {
  res.render("pages/index");
});
app.get("/verifiy", function (req, res) {
  res.render("pages/verifiy");
});
app.get("/expect", function (req, res) {
  res.render("pages/expect");
});
app.get("/succeed", function (req, res) {
  res.render("pages/succeed");
});
app.get("/checkemail", function (req, res) {
  res.render("pages/checkemail");
});
app.get("/resetpassword", function (req, res) {
  res.render("pages/resetpassword");
});

//Configure Routes

app.use("/api/v1/magicano", event);
app.use("/api/v1/auth", auth);
morgan("tiny");
//Config MiddleWare
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const start = async () => {
  try {
        await connectDB(process.env.DATABASE_URL);
      // await connectDB(config.getDBString());
     updataAsyncData();
    app.listen(config.PORT, () =>
      console.log()
    );
  } catch (error) {
    console.log(error);
  }
};
//start myapp
start();
module.exports = app;
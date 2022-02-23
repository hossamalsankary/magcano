// Import Libraries
const express = require("express"),
  app = express();

//Initializing Importint Modules
require("dotenv").config();
require("express-async-errors");

//Import Custom Modules
const updataAsyncData = require("../starter/serves/updataeverything"),
  { connectDB } = require("./db/connect"),
  auth = require("./routes/auth"),
  event = require("./routes/event"),
  notFoundMiddleware = require("./middleware/not-found"),
  errorHandlerMiddleware = require("./middleware/error-handler"),
  config = require("./configure/config"),
  bodyParser = require("body-parser");

//Careate New Express applications and Configure It
app.use(express.json());


//Configure Routes
app.use("/api/v1/magicano", event);
app.use("/api/v1/auth", auth);

//Config MiddleWare
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));
 
const start = async () => {
  try {
    // await connect("mongodb+srv://karzma:.01068944209.@cluster0.iimjq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
    await connectDB(config.getDBString());
    updataAsyncData();
    app.listen(config.PORT, () =>
      console.log(config.getSereverUrl(), "API Listen", config.getMagicanoUrl())
    );
  } catch (error) {
    console.log(error);
  }
};
start();

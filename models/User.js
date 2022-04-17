//Import Libraries
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Import Custom Mudles
const config = require("../configure/config");
const Expections = require("./expect");

//Define User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
  optVerifications:{
  type:Boolean,
  default:false
  },
  expectations: {
    type: Array,
  },
});

// Define Schema Methods
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//create Token
UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id, name: this.name }, config.JWT_SECRET, {
    expiresIn: "30d",
  });
};

//Compare The Password
UserSchema.methods.compare = async function (password) {
  const ismatch = bcrypt.compare(password, this.password);
  return ismatch;
};

module.exports = mongoose.model("UsereSchema", UserSchema);

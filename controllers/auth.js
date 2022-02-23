//login
const jwd = require("jsonwebtoken");
const userSchema = require("../models/User");
const { StatusCodes } = require("http-status-codes");

// bcryptjs
const bcrypt = require("bcryptjs");

// register
const register = async (req, res) => {
  console.log(req.body);
  try {
    const user = await userSchema.create({ ...req.body });
    let token = user.createJWT();

    res.status(StatusCodes.CREATED).send({ user: { name: user.name }, token });
    
  } catch (error) {
    res
      .status(StatusCodes.CREATED)
      .json({
        errors: {
          type: "ValidatorError",
          massage: "Sorry Something Went Wrong",
        },
      });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email | !password) {
    return res
      .status(StatusCodes.CREATED)
      .json({
        errors: {
          type: "ValidatorError",
          massage: "Sorry Something Went Wrong",
        },
      });
  }
  // let user = await userSchema.findOne({ email });
  // var istrue = await user.compare(password);
  // console.log("ismatch", istrue);
  try {
    let user = await userSchema.findOne({ email });
    var istrue = await user.compare(password);

    console.log("ismatch", istrue);
    if (istrue) {
      let token = user.createJWT();

      res.status(StatusCodes.CREATED).json({
        login: {
          status: "succeed",
        },
        token: token,
      });
    } else {
      res.status(StatusCodes.CREATED).json({
        login: {
          status: "Login failed",
        },
      });
    }
  } catch (error) {
    res
      .status(StatusCodes.CREATED)
      .json({
        errors: {
          type: "ValidatorError",
          massage: "Sorry Something Went Wrong",
        },
      });
  }
};
module.exports = {
  login,
  register,
};

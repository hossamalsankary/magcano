//Import Libraries
const jwd = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Import Custom Librares
const userSchema = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { SucceedRegister, SucceedAccess } = require("./succeed/succeed_res");

const handelErro = (massage) => ({
  errors: {
    type: "ValidatorError",
    massage: massage,
  },
});
//define User Controller
const userController = {
  //Carete A user
  register: async (req, res) => {
    try {
      //Create new user with a uniq email
      const user = await userSchema.create({ ...req.body });

      //create jwt
      let token = user.createJWT();

      //   Send Back The Respond
      let created = new SucceedRegister({
        massage: "Create new User",
        token: token,
        data: user,
      });

      res.status(StatusCodes.CREATED).json(created.succeedCrateUser);
    } catch (error) {
      res.status(StatusCodes.CREATED).json({
        errors: {
          type: "ValidatorError",
          massage: error,
        },
      });
    }
  },

  login: async (req, res) => {
    //Catch Email And Password
    const { email, password } = req.body;

    if (!email | !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(handelErro("Opps We Missing Some Data"));
    }

    try {
      //Looking For a User
      let user = await userSchema.findOne({ email });
      var istrue = await user.compare(password);

      if (istrue) {
        //Create New Token
        let token = user.createJWT();
        const login = new SucceedRegister({
          massage: "Login succeeded",
          data: user,
          token: token,
        });
        res.status(StatusCodes.CREATED).json(login.succeedLogin);
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
        .json(handelErro("Login unsucceeded"));
    }
  },
};

module.exports = {
  login: userController.login,
  register: userController.register,
};

//Import Libraries
const jwd = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Import Custom Librares
const userSchema = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const {
  SucceedRegister,
  SucceedAccess,
  HandelRspondes,
} = require("./succeed/succeed_res");
const {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors/index");

const handelErro = (massage) => ({
  errors: {
    type: "ValidatorError",
    massage: massage,
  },
});
//define User Controller
const userController = {
  //Carete A user
  register: async (req, res, next) => {
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
        next(error);
    }
  },

  login: async (req, res , next) => {
    //Catch Email And Password
    const { email, password } = req.body;

    if (!email | !password) {
      throw new BadRequestError("Opps We Missing Some Data");
    }

    try {
      //Looking For a User
      let user = await userSchema.findOne({ email });
      if(!user)        throw new UnauthenticatedError("User Not Found");

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
        throw new UnauthenticatedError("Some Thing Went Wrong");
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = {
  login: userController.login,
  register: userController.register,
};

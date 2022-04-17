//Import Libraries
const jwd = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Import Custom Librares
const userSchema = require("../models/User");
const Verifications = require("../models/optVerifications");

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
const opt = require("./opt-sender/opt-verifications-for-gmail");
const User = require("../models/User");

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
        massage: "Plase Check Your Email acount to verifiy your Email",
        token: token,
        data: user,
      });
      // create OTP code
      let code = Math.floor(Math.random() * 99999);

      //save opt
      Verifications.create({
        userid: user._id,
        opt: code,
      }).then((result) => {
        if (!result) {
          throw new BadRequestError("Opps Some Thing went wrong");
        } else {
          opt(code, user.email);
          res.status(StatusCodes.CREATED).json(created.succeedCrateUser);
        }
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    //Catch Email And Password
    const { email, password } = req.body;

    if (!email | !password) {
      throw new BadRequestError("Opps We Missing Some Data");
    }

    try {
      //Looking For a User
      let user = await userSchema.findOne({ email });
      if (!user) throw new UnauthenticatedError("User Not Found");

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
  verifications: async (req, res, next) => {
    const { userid, verifiycode } = req.body;
    if (!userid || !verifiycode) {
      throw new BadRequestError("Opps Some Thing went wrong");
    }
    //check if user is exisit

    let verifiy = await Verifications.find({ userid: userid });
    console.log(verifiy.length);

    if (!verifiy || verifiy.length == 0) {
      throw new BadRequestError("User Not Found");
    } else {
      verifiy = verifiy[0];
      if (Number(verifiy.opt) === Number(verifiycode)) {
        let optVerifications = await Verifications.findByIdAndRemove({
          _id: verifiy._id,
        });
        let updateUser = await User.findByIdAndUpdate(
          { _id: userid },
          {
            optVerifications: true,
          }
        );
        if ((!optVerifications, !updateUser)) {
          throw new BadRequestError("Opps Some Thing went wrong");
        }

        res
          .status(StatusCodes.CREATED)
          .json({ massage: "optVerifications created" });
      } else {
        throw new BadRequestError("Opps Some Thing went wrong");
      }
    }
  },
};

module.exports = {
  login: userController.login,
  register: userController.register,
  verifications: userController.verifications,
};

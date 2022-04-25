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
    console.log(req.body);

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
          .status(StatusCodes.ACCEPTED)
          .json({ massage: "verifications succeed" });
      } else {
        throw new BadRequestError("Opps Some Thing went wrong");
      }
    }
  },
  forgetPassword: async (req, res, next) => {
    //first lokking for email
    // send code to user
    // create a reset password route
    const { email } = req.body;
    if (!email) {
      throw new BadRequestError("Opps Plase Provied Your Email");
    }

    //find user
    let user = await User.findOne({ email: email });
    if (!user || user.length == 0) {
      throw new BadRequestError("Opps Plase Provied Your Email");
    }

    //saving and sending a verification code
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
        try {
          opt(code, user.email);
          res.status(StatusCodes.ACCEPTED).json({
            massage: "verifications succeed",
            data: {
              userid: user.id,
            },
          });
        } catch (error) {
          next(error);
        }
      }
    });
  },
  resetpassword: async (req, res, next) => {
    let { userid, newpassword } = req.body;
    console.log(userid, newpassword);
    let findUser = await User.find({ _id: userid });
    if (!findUser || findUser.length == 0) {
      throw new BadRequestError("Opps user not found ");
    } else {
      let salt = await bcrypt.genSalt(10);
      newpassword = await bcrypt.hash(newpassword, salt);

      let updatepassword = await User.findByIdAndUpdate(
        { _id: userid },
        { password: newpassword }
      );
      if (!updatepassword || updatepassword.length == 0)
        throw new BadRequestError("something went wrong with update password");

      res.status(StatusCodes.ACCEPTED).json({
        massage: "user password had be update",
        data: {
          userid: updatepassword,
        },
      });
    }
  },
};

module.exports = {
  login: userController.login,
  register: userController.register,
  verifications: userController.verifications,
  forgetPassword: userController.forgetPassword,
  resetpassword: userController.resetpassword,
};

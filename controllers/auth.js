//Import Libraries
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Import Custom Librares
const userSchema = require("../models/User");
const Verifications = require("../models/optVerifications");
const config = require("../configure/config");
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
      }).then(async (result) => {
        if (!result) {
          await User.remove({ id_: user.user._id });
          throw new BadRequestError("I cant handel opt sender ");
        } else {
          opt(code, user.email);
          res.status(StatusCodes.CREATED).json(created.succeedCrateUser);
        }
      });
    } catch (error) {
      next(error);
    }
  },
  //=============================================================-login-================
  login: async (req, res, next) => {
    //Catch Email And Password
    const { email, password } = req.body;
    console.log(req.body);

    if (!email | !password) {
      throw BadRequestError("Opps We Missing Some Data ");
    }
    try {
      //Looking For a User
      let user = await userSchema.findOne({ email });
      if (!user) throw new UnauthenticatedError("Plase Provied User Email");

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
        throw new UnauthenticatedError("Password Not True");
      }
    } catch (error) {
      next(error);
    }
  },
  //=============================================================-verifications-================
  verifications: async (req, res, next) => {
    let user;
    const { verifiycode, resetpassword } = req.body;
    if (!verifiycode) {
      throw new BadRequestError("Plase Provied VerifiyCode From Your Email!");
    }
    try {
      var token = req.headers.authorization;
      token = String(token).slice(7);

      console.log(token, req.body);
      var decoded = jwt.verify(token, config.JWT_SECRET);
      user = decoded.userId;

      //check if user is exisit
      let verifiy = await Verifications.find({ userid: user });

      if (!verifiy || verifiy.length == 0) {
        throw new BadRequestError("plase sigin up first");
      } else {
        verifiy = verifiy[0];
        if (Number(verifiy.opt) === Number(verifiycode)) {
          //remove opt
          let optVerifications = await Verifications.findByIdAndRemove({
            _id: verifiy._id,
          });

          //update User optVerifications
          let updateUser = await User.findByIdAndUpdate(
            { _id: user },
            {
              optVerifications: true,
            }
          );
          if ((!optVerifications, !updateUser)) {
            throw new BadRequestError(
              "optVerifications not true plase check your code"
            );
          }

          res.status(StatusCodes.ACCEPTED).json({
            massage: "verifications succeed",
            resetpassword,
          });
        } else {
          throw new BadRequestError("Opps Some Thing went wrong");
        }
      }
    } catch (error) {
      next(error);
    }
  },
  //=============================================================-forgetPassword-================
  forgetPassword: async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
      throw new BadRequestError("Opps Plase Provied Your Email");
    }

    //find user
    let user = await User.findOne({ email: email });
    if (!user || user.length == 0) {
      throw new BadRequestError("I can`t firn this user!");
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
        throw new BadRequestError(
          "Opps Some Thing went wrong with Verifications"
        );
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
//=============================================================-resendverfiycode-================
  resendverfiycode: async (req, res, next) => {
    try {
      const { email } = req.body;
      console.log(req.body);
      if (!email)
        throw new BadRequestError(
          "Opps Some Thing went wrong with Verifications"
        );

      // create OTP code
      let code = Math.floor(Math.random() * 99999);
      opt(code, email);

      let user = await User.find({ email: email });
      if (!user || user.length == 0)
        throw new BadRequestError(
          "Opps Some Thing went wrong with Verifications"
        );
      user = user[0];
      Verifications.findOneAndRemove({
        userid: user._id,
      }).then((data) => console.log(data));

      let create = await Verifications.create({
        userid: user._id,
        opt: code,
      });
      if (!create)
        throw new BadRequestError(
          "Opps Some Thing went wrong with Verifications"
        );

      let token = jwt.sign(
        { userId: user._id, name: user.name },
        config.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      res.status(StatusCodes.OK).json({ massage: "done", data: { token } });
    } catch (error) {
      next(error);
    }
  },
//===========================================================resetpassword==================
  resetpassword: async (req, res, next) => {
    let { password } = req.body;
    var token = req.headers.authorization;
    token = String(token).slice(7);

    var decoded = jwt.verify(token, config.JWT_SECRET);
    console.log(decoded);
    let findUser = await User.find({ _id: decoded.userId });
    if (!findUser || findUser.length == 0) {
      throw new BadRequestError("Opps user not found ");
    } else {
      let salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      let updatepassword = await User.findByIdAndUpdate(
        { _id: decoded.userId },
        { password: password }
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
  resendverfiycode: userController.resendverfiycode,
};

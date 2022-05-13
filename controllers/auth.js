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
const responding = require("./res_handler/responding");

//define User Controller
const userController = {
  //Cerate A user
  register: async (req, res, next) => {
    try {
      const{email , password , name} = req.body;
      console.log(email == undefined,password,name)
      if(email == undefined || password == undefined || name == undefined ){
         throw new BadRequestError("Sorry We Messing Some Data");
        }else{

          try {
            const user = await userSchema.create({ ...req.body });
            
          } catch (error) {
            throw new BadRequestError("Please Provide Uniq Email");

          }
        
      }
      //Create new user with a uniq email

      //create jwt
      let token = user.createJWT();

      // create OTP code
      //let code = Math.floor(Math.random() * 99999);
      let code = 12345;

      //save opt
      Verifications.create({
        userid: user._id,
        opt: code,
      }).then(async (result) => {
        if (!result) {
          await User.remove({ id_: user.user._id });
          throw new BadRequestError("I cant handel opt sender ");

        } else {
          //Send Massage
          opt(code, user.email);

          //Make the Responding
          let useResponding = responding.succeedRes({
            message:"Succeed Create User Please Check Your Email For Verify Code",
            data: user,
            token: token,
          });
          res.status(useResponding.code).json(useResponding);
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

    if (!email | !password) {
      throw BadRequestError(
        "Oops We Missing Some Data Check Your Emile or Password"
      );
    }
    try {
      //Looking For a User
      let user = await userSchema.findOne({ email });
      if (!user) throw new UnauthenticatedError("Sorry We can`t recognizing Your Email");

      var istrue = await user.compare(password);

      if (istrue) {
        //Create New Token
        let token = user.createJWT();

        user.password = null;

        let loginRes = responding.succeedRes({
          message:"Succeed Login ",
          statusCode:StatusCodes.ACCEPTED,
          data: user,
          token: token,
        });
        res.status(loginRes.code).json(loginRes);
      } else {
        throw new UnauthenticatedError(
          "Password Not True try To Reset Your Password"
        );
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
    //let code = Math.floor(Math.random() * 99999);
    let code = 12345;
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
      if (!email)
        throw new BadRequestError(
          "Opps Some Thing went wrong with Verifications"
        );

      // create OTP code
      let code = 12345;
      opt(code, email);

      let user = await User.find({ email: email });
      if (!user || user.length == 0)
        throw new BadRequestError(
          "Opps Some Thing went wrong with Verifications"
        );
      user = user[0];
      Verifications.findOneAndRemove({
        userid: user._id,
      });

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

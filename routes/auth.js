const express = require('express');
const router = express.Router();
const { login, register , verifications , forgetPassword  , resetpassword , resendverfiycode} = require('../controllers/auth')
//register
router.route("/register").post(register);
//login
router.route("/login").post(login);

//verifications
router.route("/verifications").post(verifications);
router.route("/forgetPassword").post(forgetPassword);
router.route("/resetpassword").post(resetpassword);
router.route("/resendverfiycode").post(resendverfiycode);



module.exports = router;

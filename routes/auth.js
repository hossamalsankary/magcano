const express = require('express');
const router = express.Router();
const { login, register , verifications , forgetPassword  , resetpassword} = require('../controllers/auth')
//register
router.route("/register").post(register);
//login
router.route("/login").post(login);

//verifications
router.route("/verifications").post(verifications);
router.route("/forgetpassword").post(forgetPassword);
router.route("/resetpassword").post(resetpassword);


module.exports = router;

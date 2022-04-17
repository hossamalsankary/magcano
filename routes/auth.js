const express = require('express');
const router = express.Router();
const { login, register , verifications } = require('../controllers/auth')
//register
router.route("/register").post(register);
//login
router.route("/login").post(login);

//verifications
router.route("/verifications").post(verifications);
module.exports = router;

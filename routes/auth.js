const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/auth')
//register
router.route("/register").post(register);
//login
router.route("/login").post(login);

module.exports = router;

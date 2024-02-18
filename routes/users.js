const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../Utilities/catchAsync');
const User = require('../Models/user');
const { storeReturnTo } = require('./middleware');




//router.route('/register').get(users.renderRegister).post(catchAsync(users.registeruser));

//router.route('/login').get(users.renderLogin).post(passport.authenticate('local', { failureflash: true, failureRedirect: '/login'}), users.login);

//router.get('/logout', users.logout);

//module.exports = router;

const express = require('express');
const router = express.Router();
const catchAsync = require('../Utilities/catchAsync.js');
const student = require('../controllers/student.js');
const { StudentSchema } = require('../schemas.js');
const Student = require('../Models/student.js');
const Review = require('../Models/review.js');
//const {isLoggedIn, isAuthor, ValidateStudent} = require('./middleware.js');

//console.log("Hello");
//router.route('/index').get(student.index);


//router.route('/:id').get(catchAsync(student.showStudent)).put(isLoggedIn, isAuthor, ValidateStudent, catchAsync(student.updateStudent)).delete( isLoggedIn, isAuthor, catchAsync(student.deleteStudent));


//module.exports = router;

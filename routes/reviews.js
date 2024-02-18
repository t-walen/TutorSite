const express = require('express');
const router = express.Router( {mergeParams: true} );
const catchAsync = require('../Utilities/catchAsync');
const reviews = require('../controllers/reviews');
const { reviewSchema } = require('../schemas.js');
const {validateReview, isLoggedIn, isReviewAuthor} = require('./middleware')
const ExpressError = require('../Utilities/expresserror');
const Ski = require('../Models/student');
const Review = require('../Models/review');



//router.route('/index').post(isLoggedIn, validateReview, catchAsync(reviews.createReview));

//router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

//


module.exports = router;

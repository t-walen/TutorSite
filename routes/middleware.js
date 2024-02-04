const { studentSchema } = require('../schemas.js');
const ExpressError = require('../Utilities/expresserror');
const Student = require('../Models/student')
const { reviewSchema } = require('../schemas.js');
const Review = require('../Models/review')


module.exports.isLoggedIn = (req, res, next) => {
 if(!req.isAuthenticated()){
    req.session.returnTo = req.originalURL
    req.flash('error',  'You must be signed in');
    return res.redirect('/login');
}
next();
}


module.exports.ValidateStudent = (req, res, next) => {
    const { error } = studentSchema.validate(req.body);
    console.log(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//module.exports.isAuthor = async (req, res, next) => {
   // const { id } = req.params;
   // const student = await Student.findById(id);
   // if(!student.author.equals(req.user._id)) {
   //     req.flash('error', 'You do not have permission');
   //    return res.redirect('/index');
  //  }
  //  next();
//}

//module.exports.isReviewAuthor = async (req, res, next) => {
 //   const { id, reviewId } = req.params;
  //  const review = await Review.findById(reviewId)
 //   if(!review.author.equals(req.user._id)) {
 //       req.flash('error', 'You do not have permission');
 //      return res.redirect('/index');
  //  }
  //  next();
//}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

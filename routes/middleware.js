const { studentSchema } = require('../schemas.js');
const ExpressError = require('../Utilities/expresserror');
const Student = require('../model/student')
const { testimonialSchema } = require('../schemas.js');
const Testimonial = require('../model/testimonials')


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


module.exports.isTestimonialAuthor = async (req, res, next) => {
    module.exports.isTestimonialAuthor = async (req, res, next) => {
        try {
            const { id, testimonialId } = req.params;
            const testimonial = await Testimonial.findById(testimonialId);

            if (!testimonial || !testimonial.author) {
                // Testimonial or its author is missing
                req.flash('error', 'Testimonial not found or missing author');
                return res.redirect('/testimonials');
            }

            if (!testimonial.author.equals(req.user._id)) {
                // User is not the author of the testimonial
                req.flash('error', 'You do not have permission');
                return res.redirect('/testimonials');
            }

            next();
        } catch (error) {
            // Handle other errors
            console.error('Error in isTestimonialAuthor middleware:', error);
            req.flash('error', 'Internal Server Error');
            res.redirect('/testimonials');
        }
    };
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

module.exports.validateTestimonial = (req, res, next) => {
    const {error} = testimonialSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

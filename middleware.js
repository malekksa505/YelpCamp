const {campgroundSchema, reviewSchema} = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');
const Camp = require('./models/campground')
module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.flash('error', 'You must singed in first to do');
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login')
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (req,res,next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg,400)
    } else {
        next();
    }
}

module.exports.isAuthor = async(req,res,next) => {
    const {id} = req.params;
    const campgrounds = await Camp.findById(id);
    if(!campgrounds.author.equals(req.user._id)){
        req.flash('error', 'you do not have the permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async(req,res,next) => {
    const {id,reviewID} = req.params;
    const review = await Review.findById(reviewID);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'you do not have the permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg,400)
    } else {
        next();
    }
}
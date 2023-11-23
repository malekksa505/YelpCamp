const express = require('express');
const router = express.Router({mergeParams: true});

const Camp = require('../models/campground')
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError');
const {reviewSchema} = require('../schemas');

const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg,400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync( async(req,res) => {
    const camp = await Camp.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await camp.save();
    await review.save();
    req.flash('success', 'The Review has been created!')
    res.redirect(`/campgrounds/${camp._id}`)
}))

router.delete('/:reviewID', catchAsync( async(req,res) => {
    const { id, reviewID } = req.params;
    await Camp.findByIdAndUpdate(id, {$pull : {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;
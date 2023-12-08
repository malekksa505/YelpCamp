const express = require('express');
const router = express.Router({mergeParams: true});

const Camp = require('../models/campground')
const Review = require('../models/review');

const {validateReview,isLoggedIn, isReviewAuthor} = require('../middleware')

const catchAsync = require('../utils/catchAsync')

router.post('/',isLoggedIn, validateReview, catchAsync( async(req,res) => {
    const camp = await Camp.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id
    camp.reviews.push(review);
    await camp.save();
    await review.save();
    req.flash('success', 'The Review has been created!')
    res.redirect(`/campgrounds/${camp._id}`)
}))

router.delete('/:reviewID',isLoggedIn, isReviewAuthor, catchAsync( async(req,res) => {
    const { id, reviewID } = req.params;
    await Camp.findByIdAndUpdate(id, {$pull : {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;
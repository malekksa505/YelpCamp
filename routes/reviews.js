const express = require('express');
const router = express.Router({mergeParams: true});

const reviewControllers = require('../controllers/reviews');

const {validateReview,isLoggedIn, isReviewAuthor} = require('../middleware')

const catchAsync = require('../utils/catchAsync')

router.post('/',isLoggedIn, validateReview, catchAsync(reviewControllers.newReview));

router.delete('/:reviewID',isLoggedIn, isReviewAuthor, catchAsync(reviewControllers.deleteReview))

module.exports = router;
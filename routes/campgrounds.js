const express = require('express');
const router = express.Router();

const Camp = require('../models/campground')

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {campgroundSchema} = require('../schemas');

const {isLoggedIn} = require('../middleware');

const validateCampground = (req,res,next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg,400)
    } else {
        next();
    }
}

router.get("/", catchAsync(async (req,res) => {
    const Camps = await Camp.find({});
    res.render('campgrounds/index', {Camps, title: 'All Camps'});
}));

router.post('/', isLoggedIn,validateCampground, catchAsync(async (req,res,next) => {
    // if(!req.body.Campground) throw new ExpressError('Invalid Campgrounds Data', 400);
    const newCamp = new Camp(req.body.Campground)
    await newCamp.save();
    req.flash('success', 'Successfully made a new Campground!')
    res.redirect(`campgrounds/${newCamp._id}`)
}))

router.get("/new", isLoggedIn, (req,res) => {
    res.render('campgrounds/new', {title: 'Add New Camp'});
})

router.get("/:id", catchAsync(async (req,res) => {
    const campFind = await Camp.findById(req.params.id).populate('reviews');
    if(!campFind) {
        req.flash('error', 'the campground doesn\'t exist anymore!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campFind, title: 'Detail Camp'})
}));

router.get("/:id/edit",isLoggedIn, catchAsync(async (req,res) => {
    const campFind = await Camp.findById(req.params.id);
    if(!campFind) {
        req.flash('error', 'the campground doesn\'t exist anymore!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campFind, title: 'Edit Camp' })
}));

router.put('/:id', isLoggedIn ,validateCampground, catchAsync(async (req,res) => {
    const { id } = req.params
    const editCamp = await Camp.findByIdAndUpdate(id,{... req.body.Campground})
    req.flash('success', 'Successfully the Campground has been updated!');
    res.redirect(`/campgrounds/${editCamp._id}`)
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req,res) => {
    const { id } = req.params
    const deleteCamp = await Camp.findByIdAndDelete(id,{... req.body.Campground})
    res.redirect(`/campgrounds`)
}));

module.exports = router;
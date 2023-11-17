const Camp = require('./models/campground')
const Review = require('./models/review');
const mongoose = require('mongoose');
const express = require('express');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync')
const path = require('path');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const {campgroundSchema, reviewSchema} = require('./schemas');



mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
})
.then(()=> {
    console.log('Successfully Connection');
})
.catch((err) => {
    console.error(err)
})

const app = express();

app.engine('ejs', ejsMate)

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const validateCampground = (req,res,next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg,400)
    } else {
        next();
    }
}

const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg,400)
    } else {
        next();
    }
}

app.get("/campgrounds", catchAsync(async (req,res) => {
    const Camps = await Camp.find({});
    res.render('campgrounds/index', {Camps, title: 'All Camps'});
}));

app.post('/campgrounds', validateCampground, catchAsync(async (req,res,next) => {
    // if(!req.body.Campground) throw new ExpressError('Invalid Campgrounds Data', 400);
    const newCamp = new Camp(req.body.Campground)
    await newCamp.save();
    res.redirect(`campgrounds/${newCamp._id}`)
}))

app.get("/campgrounds/new", (req,res) => {
    res.render('campgrounds/new', {title: 'Add New Camp'});
})

app.get("/campgrounds/:id", catchAsync(async (req,res) => {
    const campFind = await Camp.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campFind, title: 'Detail Camp'})
}));

app.get("/campgrounds/:id/edit", catchAsync(async (req,res) => {
    const campFind = await Camp.findById(req.params.id);
    res.render('campgrounds/edit', { campFind, title: 'Edit Camp' })
}));

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req,res) => {
    const { id } = req.params
    const editCamp = await Camp.findByIdAndUpdate(id,{... req.body.Campground})
    res.redirect(`/campgrounds/${editCamp._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req,res) => {
    const { id } = req.params
    const deleteCamp = await Camp.findByIdAndDelete(id,{... req.body.Campground})
    res.redirect(`/campgrounds`)
}));

app.post('/campgrounds/:id/reviews', validateReview, catchAsync( async(req,res) => {
    const camp = await Camp.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await camp.save();
    await review.save();
    res.redirect(`/campgrounds/${camp._id}`)
}))

app.delete('/campgrounds/:id/reviews/:reviewID', catchAsync( async(req,res) => {
    const { id, reviewID } = req.params;
    await Camp.findByIdAndUpdate(id, {$pull : {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/campgrounds/${id}`)
}))

app.all('*', (req,res,next) => {
    next(new ExpressError('Page Not Found!', 404))
})

app.use((err,req,res,next) => {
    const {statusCode = 500, message = 'Something Went Wrong!'} = err;
    res.status(statusCode).render('error', {err, title: 'Error'})
})

app.listen(5050, () => {
    console.log("the Server listening on 5050 Port")
})
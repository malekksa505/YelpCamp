const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const router = express.Router();
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const ExpressError = require('./utils/ExpressError');

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

const sessionConfig = {
    secret: 'malekSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(sessionConfig))
app.use(flash())

app.use((req,res,next) => {
    res.locals.success =  req.flash('success');
    res.locals.error =  req.flash('error');
    next();
})

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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
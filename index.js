const Camp = require('./models/campground')
const mongoose = require('mongoose');
const express = require('express');
const ejsMate = require('ejs-mate')
const path = require('path');
const methodOverride = require('method-override')

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

app.get("/campgrounds", async (req,res) => {
    const Camps = await Camp.find({});
    res.render('campgrounds/index', {Camps, title: 'All Camps'});
});

app.post('/campgrounds', async (req,res) => {
    const newCamp = new Camp(req.body.Campground)
    await newCamp.save();
    res.redirect(`campgrounds/${newCamp._id}`)
})

app.get("/campgrounds/new", (req,res) => {
    res.render('campgrounds/new', {title: 'Add New Camp'});
})

app.get("/campgrounds/:id", async (req,res) => {
    const campFind = await Camp.findById(req.params.id);
    res.render('campgrounds/show', { campFind, title: 'Detail Camp'})
});

app.get("/campgrounds/:id/edit", async (req,res) => {
    const campFind = await Camp.findById(req.params.id);
    res.render('campgrounds/edit', { campFind, title: 'Edit Camp' })
});

app.put('/campgrounds/:id', async (req,res) => {
    const { id } = req.params
    const editCamp = await Camp.findByIdAndUpdate(id,{... req.body.Campground})
    res.redirect(`/campgrounds/${editCamp._id}`)
})

app.delete('/campgrounds/:id', async (req,res) => {
    const { id } = req.params
    const deleteCamp = await Camp.findByIdAndDelete(id,{... req.body.Campground})
    res.redirect(`/campgrounds`)
})

app.listen(5050, () => {
    console.log("the Server listening on 5050 Port")
})
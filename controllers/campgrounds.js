const Camp = require('../models/campground')

module.exports.index = async (req,res) => {
    const Camps = await Camp.find({});
    res.render('campgrounds/index', {Camps, title: 'All Camps'});
}

module.exports.newForm = (req,res) => {
    res.render('campgrounds/new', {title: 'Add New Camp'});
}

module.exports.newCamp = async (req,res,next) => {
    // if(!req.body.Campground) throw new ExpressError('Invalid Campgrounds Data', 400);
    const newCamp = new Camp(req.body.Campground)
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success', 'Successfully made a new Campground!')
    res.redirect(`campgrounds/${newCamp._id}`)
}

module.exports.showCamp = async (req,res) => {
    const campFind = await Camp.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path:'author'
        }
    }).populate('author');
    if(!campFind) {
        req.flash('error', 'the campground doesn\'t exist anymore!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campFind, title: 'Detail Camp'})
}

module.exports.editFormCamp = async (req,res) => {
    const campFind = await Camp.findById(req.params.id);
    if(!campFind) {
        req.flash('error', 'the campground doesn\'t exist anymore!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campFind, title: 'Edit Camp' })
}

module.exports.editCamp = async (req,res) => {
    const { id } = req.params
    const editCamp = await Camp.findByIdAndUpdate(id,{... req.body.Campground})
    req.flash('success', 'Successfully the Campground has been updated!');
    res.redirect(`/campgrounds/${editCamp._id}`)
}

module.exports.deleteCamp = async (req,res) => {
    const { id } = req.params
    const deleteCamp = await Camp.findByIdAndDelete(id,{... req.body.Campground})
    res.redirect(`/campgrounds`)
}
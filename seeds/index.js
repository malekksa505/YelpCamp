const campground = require('../models/campground');
const Camp = require('../models/campground')
const mongoose = require('mongoose');
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers');

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

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await campground.deleteMany({});
    for (let i = 0; i < cities.length; i++) {
        const camp = await new campground({
            location: `${cities[i].city}, ${cities[i].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
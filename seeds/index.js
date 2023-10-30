const campground = require('../models/campground');
const Camp = require('../models/campground')
const mongoose = require('mongoose');
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers');
const axios = require('axios')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
})
.then(()=> {
    console.log('Successfully Connection');
})
.catch((err) => {
    console.error(err)
});

async function getImg() {
    try {
      const resp = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          client_id: 'LLCpf5fjMEF6RsfUw_SRS5Ipuu43E9yqvWC7vt4f6M0',
          collections: 1114848,
        },
      })
      return resp.data.urls.small
    } catch (err) {
      console.error(err)
    }
  }

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await campground.deleteMany({});
    for (let i = 0; i < cities.length; i++) {
        const price = Math.floor(Math.random() * 20) + 30;
        const camp = await new campground({
            location: `${cities[i].city}, ${cities[i].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: await getImg(),
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus deleniti voluptatum iste possimus in pariatur quasi quisquam, officia accusantium! Vel obcaecati assumenda odit, labore minus dolorum aliquam ratione id nam',
            price
        })
        await camp.save();
    }
}
console
seedDB().then(() => {
    mongoose.connection.close();
})
const joi = require('joi')

module.exports.campgroundSchema = joi.object({
    Campground:joi.object({
        title: joi.string().required(),
        price: joi.number().required().min(0),
        image: joi.string().required(),
        location: joi.string().required(),
        description: joi.string().required()
    }).required()
})

module.exports.reviewSchema = joi.object({
    review: joi.object({
        body: joi.string().required(),
        rating: joi.number().required()
    }).required()
})
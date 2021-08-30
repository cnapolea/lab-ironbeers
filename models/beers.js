// jshint esversion:10

const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema({
    apiId: {
        type: Number,
        require: true,
    },

    name: {
        type: String,
        require: true
    },

    tagline: {
        type: String,
        require: true
    },

    first_brewed: {
        type: String,
    },

    description: {
        type: String,
        require: true
    },

    image_url: {
        type: String,
        require: true
    },
    abv: Number,
    ibu: Number,
    ph: Number,
    yeast: String,
    food_pairing: [String],
    brewers_tips: String,
    tasted: {
        type: Boolean,
        default: false,
    }
});

const WishList = mongoose.model('Wishlist', wishListSchema);

module.exports = WishList;
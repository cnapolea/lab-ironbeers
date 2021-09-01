// jshint esversion:10

const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema({
    beer_id: {
        type: Number,
        required:true,
        unique:true
    },

    name: {
        type: String,
        required: true
    },

    tagline: {
        type: String,
        required: true
    },

    first_brewed: {
        type: String,
    },

    description: {
        type: String,
        required: true
    },

    image_url: {
        type: String,
        required: true
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
// jshint esversion:10

const { Mongoose } = require("mongoose");

const wishListSchema = new Mongoose.Schema({
    apiId: {
        type: Number,
        require: true
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

    description:{
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
    ingredients: {
      malt: [Array],
      hops: [Array],
      yeast: String
    },
    food_pairing: [String],
    brewers_tips: String,
});

const WishList = Mongoose.model('Wishlist', wishListSchema);

module.exports = WishList;
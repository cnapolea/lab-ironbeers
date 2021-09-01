// jshint esversion:10
const express = require('express');
const beersRouter = express.Router();
const PunkAPIWrapper = require('punkapi-javascript-wrapper');

const punkAPI = new PunkAPIWrapper();
const WishList = require('../models/beers');

beersRouter.get('', (req, res, next) => {
    punkAPI.getBeers()
        .then(beers => {
            console.log(beers);
            res.render('beers/index', {
                beers
            });
        })
        .catch(err => {
            next(err);
        });
});

beersRouter.get('/random-beer', (req, res, next) => {
    punkAPI.getRandom()
        .then(beer => {
            res.render('beers/random_beers', {
                beer
            });
        })
        .catch(err => next(err));
});

beersRouter.get('/beer/:id', (req, res, next) => {
    const id = req.params.id;
    punkAPI.getBeer(id)
        .then(beer => {
            console.log(beer);
            res.render('beers/selected_beer', {
                beer
            });
        })
        .catch(err => {
            next(err);
        });
});

beersRouter.get('/search-by', (req, res) => {
    res.render('beers/search-by');
});

beersRouter.post('', (req, res, next) => {
    console.log(req.body);
    const {
        searchBy,
        searchInput
    } = req.body;
    punkAPI.getBeers({
            [searchBy]: searchBy === 'abv_gt' ? Number(searchInput) : searchInput.replace(' ', '_')
        })
        .then(beers => {
            res.render('beers/index', {
                beers
            });
        })
        .catch(err => {
            next(err);
        });
});

beersRouter.post('/add-to-wish-list', (req, res, next) => {
    WishList.create({
            ...req.body
        })
        .then(() => {
            res.redirect('/beers/wish-list');

        })
        .catch(err => next(err));

});

beersRouter.get('/wish-list', (req, res, next) => {
    const ids = [];

    WishList.find({})
        .then(beers => {
            for (let beer of beers) {
                ids.push(beer.beer_id);
            }

            punkAPI.getBeers({ids:ids.join('|')})
            .then(beers => {
                    
                    res.render('beers/index', {
                        beers
                    });
                })
                .catch(err => next(err));

        })
        .catch(err => {
            next(err);
        });
});


module.exports = beersRouter;
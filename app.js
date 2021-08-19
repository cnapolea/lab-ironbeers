// jshint esversion:10

const express = require('express');

const hbs = require('hbs');
const path = require('path');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');

const app = express();
const punkAPI = new PunkAPIWrapper();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Register the location for handlebars partials here:
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));
// ...

// Add the route handlers here:

app.get('/', (req, res) => {
  res.render('index', {
    beerImg: '/images/beer.png'
  });
});

app.get('/beers', (req, res) => {
  punkAPI.getBeers()
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.log(error.message);
    });
  res.render('beers');
});

app.get('/random-beer', (req, res) => {
  res.render('random_beers');
});

app.listen(3000, () => console.log('🏃‍ on port 3000'));
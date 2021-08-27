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
app.use((err, req, res, next) => {
  res.redirect('/error');
});


// Register the location for handlebars partials here:
hbs.registerPartials(path.join(__dirname, 'views/partials'));
// ...

hbs.registerHelper('checklength', (description, length) => {
  if (description.length > length) {
    return description.slice(0, length) + ' ...';
  } else return description;
});

// Add the route handlers here:

app
  .get('/', (req, res) => {
    res.render('index', {
      beerImg: '/images/beer.png'
    });
  })

  .get('/beers', (req, res, next) => {
    punkAPI.getBeers()
      .then(data => {
        res.render('beers', {
          Beers: data,
        });
      })
      .catch(err => {
        next(err);
      });
  })

  .get('/random-beer', (req, res, next) => {
    const randomBeer = punkAPI.getRandom()
      .then(beer => {
        if (beer.statusCode === 404) res.redirect('/error');
        res.render('random_beers', {
          beer
        });
      })
      .catch(err => next(err));
  })
  
  .get('/beer/:id', (req, res, next) => {
    const id = req.params.id;

    punkAPI.getBeer(id)
      .then(beer => {
        if (beer.statusCode === 404) res.redirect('/error');
        res.render('selected_beer', {
          beer
        });
      })
      .catch(err => {
        next(err);
      });
  })

  .get('/error', (req, res) => {
    res.render('error', {
      status: 404,
    });
  });

app.get('*', (req, res) => {
  res.redirect('/error');
});

app.listen(3000, () => console.log('🏃‍ on port 3000'));
// jshint esversion:10

require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');
const mongoose = require('mongoose');
const sassMiddleware = require('node-sass-middleware');
const morgan = require('morgan');
const serveFavicon = require('serve-favicon');

const WishList = require('./models/beers');

const app = express();
const punkAPI = new PunkAPIWrapper();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


app.use(serveFavicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.urlencoded({
  extended: true
}));
app.use(sassMiddleware({
  dest: path.join(__dirname, 'public/stylesheets'),
  src: path.join(__dirname, 'styles'),
  force: true,
  outputStyle: 'expanded',
  prefix: '/stylesheets'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));


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
    if (req.body !== undefined) {

    }
    punkAPI.getBeers()
      .then(beers => {
        res.render('beers', {
          beers
        });
      })
      .catch(err => {
        next(err);
      });
  })

  .get('/random-beer', (req, res, next) => {
    punkAPI.getRandom()
      .then(beer => {
        console.log(beer);
        if (beer.statusCode === 404 || beer.statusCode === 404) res.redirect('/error');
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
        if (beer.statusCode === 404 || beer.statusCode === 404) res.redirect('/error');
        res.render('selected_beer', {
          beer
        });
      })
      .catch(err => {
        next(err);
      });
  })

  .get('/search-by', (req, res) => {
    res.render('search-by');
  })

  .post('/beers', (req, res, next) => {
    console.log(req.body);
    const {
      searchBy,
      searchInput
    } = req.body;
    punkAPI.getBeers({
        [searchBy]: searchBy === 'abv_gt' ? Number(searchInput) : searchInput.replace(' ', '_')
      })
      .then(beers => {
        console.log(beers);
        if (beers.statusCode === 404 || beers.statusCode === 404 || beers === []) res.redirect('/error');
        res.render('beers', {
          beers
        });
      })
      .catch(err => {
        next(err);
      });
  })
  .post('/beers', (req, res, next) => {
    console.log(req.body);
    const {
      searchBy,
      searchInput
    } = req.body;
    punkAPI.getBeers({
        [searchBy]: searchBy === 'abv_lt' ? Number(searchInput) : searchInput.replace(' ', '_')
      })
      .then(beers => {
        console.log(beers);
        if (beers.statusCode === 404 || beers.statusCode === 404 || beers === []) res.redirect('/error');
        res.render('beers', {
          beers
        });
      })
      .catch(err => {
        next(err);
      });
  })

  .post('/add-to-wish-list', (req, res, next) => {
    const {apiID, name, tagline, first_brewed, description, image_url, abv, ibu, ph, yeast, food_pairing, brewers_tips} = req.body;
    
    WishList.create({
      apiID,
      name,
      tagline,
      first_brewed,
      description,
      image_url,
      abv,
      ibu,
      ph,
      yeast,
      food_pairing: food_pairing.split(','),
      brewers_tips
    })
      .then((data) => {
        res.redirect('/wish-list');

      })
      .catch(err => next(err));

  })
  .get('/wish-list', (req, res, next) => {
      WishList.find({})
        .then(beers => {
          // if (beers.length < 1) throw new Error();
          res.render('beers', {
            beers
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

app.use((err, req, res, next) => {
  res.redirect('/error');
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => console.log(`🏃‍ on port ${process.env.PORT}`));
  })
  .catch(error => {
    throw new Error(error.message);
  });
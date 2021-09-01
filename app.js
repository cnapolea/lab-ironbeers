// jshint esversion:10

const express = require('express');
const hbs = require('hbs');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const morgan = require('morgan');
const serveFavicon = require('serve-favicon');

const app = express();


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

const beersRouter = require('./routes/beers');

app
  .get('/', (req, res) => {
    res.render('index', {
      beerImg: '/images/beer.png'
    });
  });

app.use('/beers', beersRouter);

app.get('/error', (req, res) => {
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

module.exports = app;
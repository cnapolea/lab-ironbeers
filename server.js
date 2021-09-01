// jshint esversion:10

require('dotenv').config();

const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => console.log(`🏃‍ on port ${process.env.PORT}`));
  })
  .catch(error => {
    throw new Error(error.message);
  });
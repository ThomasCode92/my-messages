const path = require('path');

const express = require('express');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts.routes');

const app = express();

mongoose
  .connect(
    `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mongodb:27017/mymessages?authSource=admin`
  )
  .then(() => {
    console.log('Connected to database');
  })
  .catch(error => {
    console.log(error);
    console.log('Connection failed');
  });

app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );

  next();
});

app.use('/api/posts', postsRoutes);

module.exports = app;

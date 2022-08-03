const express = require('express');
const mongoose = require('mongoose');

const Post = require('./models/post.model');

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

app.get('/api/posts', (req, res, next) => {
  Post.find().then(posts => {
    res.status(200).json({ message: 'Posts fetched succesfully!', posts });
  });
});

app.get('/api/posts/:id', (req, res, next) => {
  const postId = req.params.id;

  Post.findById(postId).then(post => {
    if (post) {
      res.status(200).json({ message: 'Post fetched succesfully!', post });
    } else {
      res.status(204).json({ message: 'Post not found!' });
    }
  });
});

app.post('/api/posts', (req, res, next) => {
  const { title, content } = req.body;

  const post = new Post({ title, content });
  post.save().then(createdPost => {
    res
      .status(201)
      .json({ message: 'Post added succesfully!', postId: createdPost._id });
  });
});

app.put('/api/posts/:id', (req, res, next) => {
  const postId = req.params.id;
  const { title, content } = req.body;

  const post = new Post({ _id: postId, title, content });

  Post.updateOne({ _id: postId }, post).then(result => {
    res.status(201).json({ message: 'Post updated succesfully!' });
  });
});

app.delete('/api/posts/:id', (req, res, next) => {
  const postId = req.params.id;

  Post.deleteOne({ _id: postId }).then(() => {
    res.status(201).json({ message: 'Post deleted succesfully!' });
  });
});

module.exports = app;

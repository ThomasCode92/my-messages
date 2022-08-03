const express = require('express');

const Post = require('../models/post.model');

const router = express.Router();

router.get('/', (req, res, next) => {
  Post.find().then(posts => {
    res.status(200).json({ message: 'Posts fetched succesfully!', posts });
  });
});

router.get('/:id', (req, res, next) => {
  const postId = req.params.id;

  Post.findById(postId).then(post => {
    if (post) {
      res.status(200).json({ message: 'Post fetched succesfully!', post });
    } else {
      res.status(204).json({ message: 'Post not found!' });
    }
  });
});

router.post('/', (req, res, next) => {
  const { title, content } = req.body;

  const post = new Post({ title, content });
  post.save().then(createdPost => {
    res
      .status(201)
      .json({ message: 'Post added succesfully!', postId: createdPost._id });
  });
});

router.put('/:id', (req, res, next) => {
  const postId = req.params.id;
  const { title, content } = req.body;

  const post = new Post({ _id: postId, title, content });

  Post.updateOne({ _id: postId }, post).then(result => {
    res.status(201).json({ message: 'Post updated succesfully!' });
  });
});

router.delete('/:id', (req, res, next) => {
  const postId = req.params.id;

  Post.deleteOne({ _id: postId }).then(() => {
    res.status(201).json({ message: 'Post deleted succesfully!' });
  });
});

module.exports = router;

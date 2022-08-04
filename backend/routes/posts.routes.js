const express = require('express');
const multer = require('multer');

const Post = require('../models/post.model');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type!');

    if (isValid) {
      error = null;
    }

    cb(error, 'images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const extension = MIME_TYPE_MAP[file.mimetype];

    cb(null, `${name}-${Date.now()}.${extension}`);
  },
});

router.get('/', (req, res, next) => {
  Post.find().then(posts => {
    res.status(200).json({ message: 'Posts fetched successfully!', posts });
  });
});

router.get('/:id', (req, res, next) => {
  const postId = req.params.id;

  Post.findById(postId).then(post => {
    if (post) {
      res.status(200).json({ message: 'Post fetched successfully!', post });
    } else {
      res.status(204).json({ message: 'Post not found!' });
    }
  });
});

router.post('/', multer({ storage }).single('image'), (req, res, next) => {
  const { title, content } = req.body;
  const { file } = req;

  const url = `${req.protocol}://${req.get('host')}`;

  const post = new Post({
    title,
    content,
    imagePath: `${url}/images/${file.filename}`,
  });

  post.save().then(createdPost => {
    res.status(201).json({ message: 'Post added successfully!', post });
  });
});

router.put('/:id', multer({ storage }).single('image'), (req, res, next) => {
  const postId = req.params.id;
  const { title, content } = req.body;
  const { file } = req;

  let { imagePath } = req.body;

  if (file) {
    const url = `${req.protocol}://${req.get('host')}`;
    imagePath = `${url}/images/${file.filename}`;
  }

  const post = new Post({ _id: postId, title, content, imagePath });

  Post.updateOne({ _id: postId }, post).then(result => {
    res.status(201).json({ message: 'Post updated successfully!' });
  });
});

router.delete('/:id', (req, res, next) => {
  const postId = req.params.id;

  Post.deleteOne({ _id: postId }).then(() => {
    res.status(201).json({ message: 'Post deleted successfully!' });
  });
});

module.exports = router;

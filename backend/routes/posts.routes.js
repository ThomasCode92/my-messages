const express = require('express');

const checkAuth = require('../middleware/check-auth');
const fileUpload = require('../middleware/file-upload');

const postsController = require('../controllers/posts.controller');

const router = express.Router();

router
  .route('/')
  .get(postsController.getPosts)
  .post(checkAuth, fileUpload, postsController.addPost);

router
  .route('/:id')
  .get(postsController.getPost)
  .put(checkAuth, fileUpload, postsController.updatePost)
  .delete(checkAuth, postsController.deletePost);

module.exports = router;

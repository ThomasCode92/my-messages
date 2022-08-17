const express = require('express');
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');

const postsController = require('../controllers/posts.controller');

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

router.get('/', postsController.getPosts);

router.get('/:id', postsController.getPost);

router.post(
  '/',
  checkAuth,
  multer({ storage }).single('image'),
  postsController.addPost
);

router.put(
  '/:id',
  checkAuth,
  multer({ storage }).single('image'),
  postsController.updatePost
);

router.delete('/:id', checkAuth, postsController.deletePost);

module.exports = router;

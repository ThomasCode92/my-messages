const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');

const router = express.Router();

router.post('/signup', (req, res, next) => {
  const { email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then(hashedPassword => {
      const user = new User({ email, password: hashedPassword });
      return user.save();
    })
    .then(user => {
      res.status(201).json({ message: 'User created successfully!', user });
    })
    .catch(error => {
      res.status(500).json({ message: 'Something went wrong!', error });
    });
});

module.exports = router;

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  const authError = new Error('Auth failed!');
  authError.status = 401;

  let user;

  User.findOne({ email })
    .then(fetchedUser => {
      if (!fetchedUser) throw authError;

      user = fetchedUser;
      return bcrypt.compare(password, user.password);
    })
    .then(passwordsDoMatch => {
      if (!passwordsDoMatch) throw authError;

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ message: 'Auth successful!', token });
    })
    .catch(error => {
      const statusCode = error.status || 500;

      if (statusCode === 401) {
        res.status(statusCode).json({ message: error.message });
      } else {
        res.status(statusCode).json({ message: 'Something went wrong!' });
      }
    });
});

module.exports = router;

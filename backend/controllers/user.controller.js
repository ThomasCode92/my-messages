const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

exports.createUser = (req, res, next) => {
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
      if (error._message) {
        res.status(401).json({ message: error._message });
      } else {
        res.status(500).json({ message: 'Something went wrong!', error });
      }
    });
};

exports.userLogin = (req, res, next) => {
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

      res.status(200).json({
        message: 'Auth successful!',
        userId: user._id,
        token,
        expiresIn: 3600,
      });
    })
    .catch(error => {
      const statusCode = error.status || 500;

      if (statusCode === 401) {
        res.status(statusCode).json({ message: error.message });
      } else {
        res.status(statusCode).json({ message: 'Something went wrong!' });
      }
    });
};

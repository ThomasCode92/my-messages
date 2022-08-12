const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  try {
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userData = { userId: decodedToken.userId, email: decodedToken.email };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Auth failed!' });
  }
};

module.exports = checkAuth;

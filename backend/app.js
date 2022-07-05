const express = require('express');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );

  next();
});

app.use('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: 'abc123',
      title: 'First Post',
      content: "This is the first posts's content",
    },
    {
      id: 'def456',
      title: 'Second Post',
      content: "This is the second posts's content",
    },
    {
      id: 'ghi789',
      title: 'Third Post',
      content: "This is the third posts's content",
    },
  ];

  res.status(200).json({ message: 'Posts fetched succesfully', posts });
});

module.exports = app;

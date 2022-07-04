const express = require('express');

const app = express();

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

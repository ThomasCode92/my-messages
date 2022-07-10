const express = require('express');

const Post = require('./models/post.model');

const app = express();

app.use(express.json());

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

app.get('/api/posts', (req, res, next) => {
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

  res.status(200).json({ message: 'Posts fetched succesfully!', posts });
});

app.post('/api/posts', (req, res, next) => {
  const { title, content } = req.body;

  const post = new Post({ title, content });

  console.log(post);

  res.status(201).json({ message: 'Post added succesfully!', post });
});

module.exports = app;

const Post = require('../models/post.model');

exports.getPosts = (req, res, next) => {
  const currentPage = parseInt(req.query.page);
  const pageSize = parseInt(req.query.pagesize);

  const postQuery = Post.find();

  if (currentPage && pageSize) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  let fetchedPosts;

  postQuery
    .then(posts => {
      fetchedPosts = posts;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch(error => {
      res.status(500).json({ message: 'Fetching posts failed!' });
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.id;

  Post.findById(postId)
    .then(post => {
      if (post) {
        res.status(200).json({ message: 'Post fetched successfully!', post });
      } else {
        res.status(204).json({ message: 'Post not found!' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Fetching a post failed!' });
    });
};

exports.addPost = (req, res, next) => {
  const { title, content } = req.body;
  const { file, userData } = req;

  const url = `${req.protocol}://${req.get('host')}`;

  const post = new Post({
    title,
    content,
    imagePath: `${url}/images/${file.filename}`,
    creator: userData.userId,
  });

  post
    .save()
    .then(createdPost => {
      res.status(201).json({ message: 'Post added successfully!', post });
    })
    .catch(error => {
      res.status(500).json({ message: 'Creating a post failed!' });
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.id;
  const { title, content, creator } = req.body;
  const { file, userData } = req;

  let { imagePath } = req.body;

  if (file) {
    const url = `${req.protocol}://${req.get('host')}`;
    imagePath = `${url}/images/${file.filename}`;
  }

  const post = new Post({ _id: postId, title, content, imagePath, creator });

  Post.updateOne({ _id: postId, creator: userData.userId }, post)
    .then(result => {
      if (result.modifiedCount > 0) {
        res.status(201).json({ message: 'Post updated successfully!' });
      } else {
        res.status(401).json({ message: 'Not authorized' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Updating a post failed!' });
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.id;
  const { userData } = req;

  Post.deleteOne({ _id: postId, creator: userData.userId })
    .then(result => {
      if (result.deletedCount > 0) {
        res.status(201).json({ message: 'Post deleted successfully!' });
      } else {
        res.status(401).json({ message: 'Not authorized' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Deleting a post failed!' });
    });
};

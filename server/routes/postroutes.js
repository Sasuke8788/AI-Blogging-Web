const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const jwt = require('jsonwebtoken');
const renderPostToHTML = require('../ssrPostRenderer');


// ✅ Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

// ✅ Create a new post (Protected Route)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, content, tags, isPremium } = req.body;
    const newPost = new Post({
      title,
      content,
      tags,
      isPremium,
      author: req.user.id
    });

    await newPost.save();
    res.json(newPost);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ Get a single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name');

    if (!post) return res.status(404).json({ msg: 'Post not found' });

    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// GET posts by current logged-in user
router.get('/my-posts', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get('/ssr/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name');
    if (!post) return res.status(404).send('Post not found');

    const html = renderPostHTML(post);
    res.send(html);
  } catch (err) {
    res.status(500).send('Error rendering post');
  }
});

module.exports = router; 


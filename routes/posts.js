const express = require('express');
// eslint-disable-next-line object-curly-newline
const { getAllPosts, createPost, followingPosts, myPosts, like, comment, deletePost } = require('../controllers/post');

const isLoggedIn = require('../middleware/isLoggedIn');

const router = express.Router();
router.get('/posts', isLoggedIn, getAllPosts);
router.post('/post', isLoggedIn, createPost);
router.get('/followingposts', isLoggedIn, followingPosts);
router.get('/mypost', isLoggedIn, myPosts);
router.put('/like', isLoggedIn, like);
router.put('/comment', isLoggedIn, comment);
router.delete('/deletepost/:postId', isLoggedIn, deletePost);

module.exports = router;

const express = require('express');
// eslint-disable-next-line object-curly-newline
const { getUsers, loginUser, signupUser, getUserById, followUser, unfollowUser } = require('../controllers/users');

const isLoggedIn = require('../middleware/isLoggedIn');

const router = express.Router();
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/user/:id', isLoggedIn, getUserById);
router.put('/follow', isLoggedIn, followUser);
router.put('/unfollow', isLoggedIn, unfollowUser);
module.exports = router;

const router = require('express').Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');

const secret = process.env.secret;
const User = require('../models/user.model');
const checkLogin = require('../middleware/checkLogin');
const Post = require('../models/post.model');

router.route('/signup').post(async (req, res) => {
  const temp = await User.findOne({ email: req.body.email });
  if (temp) { return res.json({ Error: +'Person with same email already exists!' }); }

  const name = req.body.name;
  const email = req.body.email;
  const password = md5(req.body.password);
  const newUser = new User({
    name,
    email,
    password,
  });
  newUser.save()
    .then(() => res.json('User added!'))
    .catch((err) => res.status(400).json(`Error: +${err}`));
});

router.route('/login').post((req, res) => {
  const email = req.body.email;
  const password = md5(req.body.password);
  User.findOne({ email }, (err, foundUser) => {
    if (!foundUser) {
      return res.json('user does not exist');
    }

    if (foundUser.password === password) {
      const token = jwt.sign({ _id: foundUser._id }, secret);
      const {
        _id, name, email, friends,
      } = foundUser;
      return res.json({
        token,
        user: {
          _id, name, email, friends,
        },
      });
    }
    return res.json('password is wrong');
  });
});

router.route('/').get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.json(`Error${err}`));
});

router.route('/user/:id').get(checkLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select('-password')
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate('postedBy', '_id name')
        .exec((err, posts) => {
          if (err) {
            return res.json({ err });
          }
          return res.json({ user, posts });
        });
    }).catch((err) => res.json({ err: 'Users not found' }));
});

router.put('/follow', checkLogin, (req, res) => {
  User.findByIdAndUpdate(req.body.followId, {
    $push: { friends: req.user._id },
  }, {
    new: true,
  }, (err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    }
    User.findByIdAndUpdate(req.user._id, {
      $push: { friends: req.body.followId },

    }, { new: true }).then((result) => {
      res.json(result);
    }).catch((err) => res.status(422).json({ error: err }));
  });
});

router.put('/unfollow', checkLogin, (req, res) => {
  User.findByIdAndUpdate(req.body.unfollowId, {
    $pull: { friends: req.user._id },
  }, {
    new: true,
  }, (err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    }
    User.findByIdAndUpdate(req.user._id, {
      $pull: { friends: req.body.unfollowId },

    }, { new: true }).select('-password').then((result) => {
      res.json(result);
    }).catch((err) => res.status(422).json({ error: err }));
  });
});
module.exports = router;

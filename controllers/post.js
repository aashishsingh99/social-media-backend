const router = require('express').Router();
const Post = require('../models/post.model');

module.exports.getAllPosts = (req, res) => {
  Post.find()
    .populate('postedBy', 'name _id')
    .populate('comments.postedBy', 'name _id')
    .then((posts) => res.json({ posts }))
    .catch((err) => res.status(400).json(`Error: ${err}`));
};

module.exports.createPost = (req, res) => {
  const post = req.body.post;
  req.user.password = undefined;
  const newPost = new Post({ post, postedBy: req.user });
  newPost.save()

    .then((data) => res.json({ post: data }))
    .catch((err) => res.status(400).json(`Error: ${err}`));
};

module.exports.followingPosts = (req, res) => {
  Post.find({ postedBy: { $in: req.user.friends } })

    .populate('postedBy', 'name _id')
    .populate('comments.postedBy', 'name _id')
    .then((posts) => res.json({ posts }))
    .catch((err) => res.status(400).json(`Error: ${err}`));
};

module.exports.myPosts = (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate('postedBy', 'name _id')
    .then((mypost) => { res.json({ mypost }); })
    .catch((err) => res.json(err));
};

module.exports.like = (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {
    $push: { likes: req.user._id },
  }, {
    new: true,
  }).exec((err, result) => {
    if (err) {
      return res.json(err);
    }

    return res.json(result);
  });
};

module.exports.comment = (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(req.body.postId, {
    $push: { comments: comment },
  }, {
    new: true,
  })
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.json({ error: err });
      }

      return res.json(result);
    });
};
module.exports.deletePost = (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate('postedBy', '_id')
    .exec((err, post) => {
      if (err || !post) {
        return res.json({ err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post.remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
};

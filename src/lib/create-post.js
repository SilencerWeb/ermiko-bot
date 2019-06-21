const { Post } = require('../models');


const createPost = (post) => {
  const newPost = new Post(post);
  return newPost.save();
};


module.exports = { createPost };


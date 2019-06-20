const { formatPost } = require('./');
const { Post } = require('../models');
const { CHANNELS_INFO } = require('../constants');


const createPost = (post) => {
  const formattedPost = formatPost(post);

  formattedPost.status = 'waitingForModeration';
  formattedPost.channel = Object.keys(CHANNELS_INFO).find((channelName) => CHANNELS_INFO[channelName].subreddit === post.data.subreddit);

  const newPost = new Post(formattedPost);

  return newPost.save();
};


module.exports = { createPost };


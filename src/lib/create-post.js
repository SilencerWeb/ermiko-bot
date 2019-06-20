const { formatPost } = require('./format-post');
const { Post } = require('../models');
const { CHANNELS_INFO } = require('../constants');


const createPost = (post) => {
  const formattedPost = formatPost(post);

  formattedPost.status = 'waitingForModeration';
  formattedPost.channel = Object.keys(CHANNELS_INFO).find((channelName) => CHANNELS_INFO[channelName].subreddit === post.data.subreddit);

  const newPost = new Post(formattedPost);

  return newPost.save((error) => {
    if (error) {
      console.log('Error on saving new post!');
      console.log(`Error message: ${error.message}`);
    }
  });
};


module.exports = { createPost };


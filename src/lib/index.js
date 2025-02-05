const { formatPost } = require('./format-post');
const { createPost } = require('./create-post');
const { sendPost } = require('./send-post');
const { sendPostToModerationGroup } = require('./send-post-to-moderation-group');
const { sendPostToChannel } = require('./send-post-to-channel');


module.exports = {
  formatPost,
  createPost,
  sendPost,
  sendPostToModerationGroup,
  sendPostToChannel,
};

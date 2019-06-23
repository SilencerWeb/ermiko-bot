const { sendPost } = require('./send-post');


const sendPostToChannel = (post, channelUsername) => {
  return sendPost(post, channelUsername);
};


module.exports = { sendPostToChannel };

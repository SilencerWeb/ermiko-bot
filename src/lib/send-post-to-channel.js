const { sendPost } = require('./send-post');


const sendPostToChannel = (post, channel) => {
  return sendPost(post, channel);
};


module.exports = { sendPostToChannel };

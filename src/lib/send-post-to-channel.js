const { sendPost } = require('./send-post');


const sendPostToChannel = (post, channel) => {
  sendPost(post, channel);
};


module.exports = { sendPostToChannel };

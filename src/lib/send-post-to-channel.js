const { sendPost } = require('./');


const sendPostToChannel = (post, channel) => {
  sendPost(post, channel);
};


module.exports = { sendPostToChannel };

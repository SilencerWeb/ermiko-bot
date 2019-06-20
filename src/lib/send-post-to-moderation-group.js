const { sendPost } = require('./send-post');
const { CHANNELS_INFO } = require('../constants');


const sendPostToModerationGroup = (post, channel) => {
  const channelInfo = CHANNELS_INFO[channel];
  const channelModerationGroup = channelInfo.moderationGroup;

  sendPost(post, channelModerationGroup, true);
};


module.exports = { sendPostToModerationGroup };

const { sendPost } = require('./send-post');
const { CHANNELS_INFO, IS_PRODUCTION, DEVELOPMENT_GROUP_ID } = require('../constants');


const sendPostToModerationGroup = (post, channel) => {
  const channelInfo = CHANNELS_INFO[channel];
  const moderationGroupId = IS_PRODUCTION ? channelInfo.moderationGroupId : DEVELOPMENT_GROUP_ID;

  sendPost(post, moderationGroupId, true);
};


module.exports = { sendPostToModerationGroup };

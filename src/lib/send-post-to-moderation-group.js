const { sendPost } = require('./send-post');
const { getChannel } = require('../utils');
const { IS_PRODUCTION, DEVELOPMENT_GROUP_ID } = require('../constants');


const sendPostToModerationGroup = (post, channelName) => {
  const channel = getChannel(channelName);
  const moderationGroupId = IS_PRODUCTION ? channel.moderationGroupId : DEVELOPMENT_GROUP_ID;

  return sendPost(post, moderationGroupId, true);
};


module.exports = { sendPostToModerationGroup };

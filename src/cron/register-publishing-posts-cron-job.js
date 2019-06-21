const CronJob = require('cron').CronJob;
const { sendPostToChannel } = require('../lib');
const { Post } = require('../models');
const { CHANNELS_INFO, IS_PRODUCTION, DEVELOPMENT_CHANNEL_ID } = require('../constants');


const publishRandomApprovedPost = async (channel) => {
  const post = await Post.findOne({ status: 'approved' });
  if (!post) throw new Error('No approved posts');

  return sendPostToChannel(post, channel);
};


const registerPublishingPostsCronJob = () => {

  new CronJob('0 0 * * * *', () => { // Every hour
    Object.keys(CHANNELS_INFO).forEach((channel) => {
      channel = IS_PRODUCTION ? channel : DEVELOPMENT_CHANNEL_ID;

      publishRandomApprovedPost(channel).catch((error) => {
        console.log(`Error on publishing post to the channel "${channel}"!`);
        console.log(`Error message: ${error.message}`);
      });
    });
  }, null, true);
};


module.exports = { registerPublishingPostsCronJob };

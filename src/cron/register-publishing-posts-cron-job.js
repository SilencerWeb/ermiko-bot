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
    if (IS_PRODUCTION) {
      Object.keys(CHANNELS_INFO).forEach((channel) => {
        publishRandomApprovedPost(channel).catch((error) => {
          console.log(`Error on publishing post to the channel "${channel}"!`);
          console.log(`Error message: ${error.message}`);
        });
      });
    } else {
      publishRandomApprovedPost(DEVELOPMENT_CHANNEL_ID).catch((error) => {
        console.log(`Error on publishing post to the development channel!`);
        console.log(`Error message: ${error.message}`);
      });
    }
  }, null, true);
};


module.exports = { registerPublishingPostsCronJob };

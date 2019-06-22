const CronJob = require('cron').CronJob;
const { sendPostToChannel } = require('../lib');
const { Post } = require('../models');
const { CHANNELS_INFO, IS_PRODUCTION, DEVELOPMENT_CHANNEL_ID } = require('../constants');


const publishRandomApprovedPost = async (channel) => {
  const queryOptions = {
    status: 'approved',
  };

  if (IS_PRODUCTION === true) {
    queryOptions.channel = channel;
    channel = `@${channel}`;
  }

  const post = await Post.findOne(queryOptions);
  if (!post) throw new Error('No approved posts');

  return sendPostToChannel(post, channel);
};


const registerPublishingPostsCronJob = () => {
  const CRON_JOB_TIMES = [
    '0 0 * * * *', // Every 0th minute
    '0 30 3-15 * * *', // Every 30th minute between 3:00 and 15:00 UTC (8:00 and 20:00 GMT+5, Tashkent)
  ];

  CRON_JOB_TIMES.forEach((cronJobTime) => {
    new CronJob(cronJobTime, () => {
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
  });
};


module.exports = { registerPublishingPostsCronJob };

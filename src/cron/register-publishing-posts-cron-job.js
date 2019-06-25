const CronJob = require('cron').CronJob;
const { sendPostToChannel } = require('../lib');
const { getChannel } = require('../utils');
const { Post } = require('../models');
const { CHANNELS, IS_PRODUCTION, DEVELOPMENT_CHANNEL_ID } = require('../constants');


const publishRandomApprovedPost = async (channelName) => {
  let chat = channelName;
  const queryOptions = { status: 'approved' };

  if (IS_PRODUCTION) {
    const channel = getChannel(channelName);
    if (!channel) throw new Error(`Channel "${channelName}" doesn't exist`);

    chat = channel.username;
    queryOptions.channelName = channelName;
  }

  const post = await Post.findOne(queryOptions);
  if (!post) throw new Error('No approved posts');

  return sendPostToChannel(post, chat);
};


const registerPublishingPostsCronJob = () => {
  const CRON_JOB_TIMES = [
    '0 0 3-19 * * *', // Every 0th minute between 3:00 and 19:00 UTC+0 (8:00 and 00:00 UTC+5, Tashkent)
    '30 4,6,8,10,12,14,16,18 * * *',
  ];

  CRON_JOB_TIMES.forEach((cronJobTime) => {
    new CronJob(cronJobTime, () => {
      if (IS_PRODUCTION) {
        CHANNELS.forEach((channel) => {
          publishRandomApprovedPost(channel.name).catch((error) => {
            console.log(`Error on publishing post to the channel "${channel.name}"!`);
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

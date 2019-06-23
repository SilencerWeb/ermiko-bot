const CronJob = require('cron').CronJob;
const axios = require('axios');
const { createPost, formatPost, sendPostToModerationGroup } = require('../lib');
const { getCurrentUTCDate, transformUnixTimestampIntoDate, getOffsetDate, getChannel } = require('../utils');
const { Post } = require('../models');
const { CHANNELS, IS_PRODUCTION, DEVELOPMENT_CHANNEL_ID } = require('../constants');


const fetchNewPosts = (channelName) => {
  const channel = getChannel(channelName);
  const subreddit = channel.subreddit;
  const subredditNewPostsUrl = `https://reddit.com/r/${subreddit}/new.json?limit=100`;

  return axios.get(subredditNewPostsUrl).catch((error) => {
    console.log(`Error on fetching new posts from subreddit "${subreddit}"!`);
    console.log(`Error message: ${error.message}`);
  });
};

const getPostsFromFetchResponse = (fetchResponse) => {
  return [...fetchResponse.data.data.children];
};

const getRecentPosts = (posts) => {
  return posts.filter((post) => {
    const postPublishingDate = transformUnixTimestampIntoDate(post.data.created_utc);
    const currentUTCDate = getCurrentUTCDate();
    const currentUTCDateWith15MinutesOffset = getOffsetDate(currentUTCDate, 900000); // 900000 milliseconds = 15 minutes
    const currentUTCDateWith15Minutes30SecondsOffset = getOffsetDate(currentUTCDateWith15MinutesOffset, 30000); // 30000 milliseconds = 30 seconds

    return currentUTCDateWith15Minutes30SecondsOffset <= postPublishingDate && postPublishingDate <= currentUTCDateWith15MinutesOffset;
  });
};


const registerFetchingNewPostsCronJob = () => {
  const WAITING_FOR_MODERATION_POSTS_LIMIT = 20;

  new CronJob('*/30 * * * * *', () => { // Every 30th second
    CHANNELS.forEach(async (channel) => {
      let waitingForModerationPostsAmount = await Post.countDocuments({
        channelName: channel.name,
        status: 'waitingForModeration',
      });
      if (waitingForModerationPostsAmount > WAITING_FOR_MODERATION_POSTS_LIMIT) return;

      const fetchResponse = await fetchNewPosts(channel.name);
      if (!fetchResponse) return;

      const posts = getPostsFromFetchResponse(fetchResponse);
      const recentPosts = getRecentPosts(posts);

      recentPosts.forEach((post) => {
        const formattedPost = formatPost(post);
        if (!formattedPost) return;

        waitingForModerationPostsAmount += 1;
        if (waitingForModerationPostsAmount > WAITING_FOR_MODERATION_POSTS_LIMIT) return;

        const channel = IS_PRODUCTION ? CHANNELS.find((channel) => channel.subreddit === post.data.subreddit) : DEVELOPMENT_CHANNEL_ID;
        formattedPost.channelName = IS_PRODUCTION ? channel.name : channel;

        createPost(formattedPost)
          .then((savedPost) => sendPostToModerationGroup(savedPost, savedPost.channelName))
          .catch((error) => {
            console.log('Error on saving new post!');
            console.log(`Error message: ${error.message}`);
          });
      });
    });
  }, null, true);
};


module.exports = { registerFetchingNewPostsCronJob };

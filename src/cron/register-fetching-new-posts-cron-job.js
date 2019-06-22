const CronJob = require('cron').CronJob;
const axios = require('axios');
const { createPost, formatPost, sendPostToModerationGroup } = require('../lib');
const { getCurrentUTCDate, transformUnixTimestampIntoDate, getOffsetDate } = require('../utils');
const { Post } = require('../models');
const { CHANNELS_INFO } = require('../constants');


const fetchNewPosts = (channel) => {
  const channelInfo = CHANNELS_INFO[channel];
  const subreddit = channelInfo.subreddit;
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
    Object.keys(CHANNELS_INFO).forEach(async (channelName) => {
      const waitingForModerationPostsAmount = await Post.countDocuments({ channel: channelName, status: 'waitingForModeration' });
      if (waitingForModerationPostsAmount > WAITING_FOR_MODERATION_POSTS_LIMIT) return;

      const fetchResponse = await fetchNewPosts(channelName);
      if (!fetchResponse) return;

      const posts = getPostsFromFetchResponse(fetchResponse);
      const recentPosts = getRecentPosts(posts);

      recentPosts.forEach((post) => {
        const formattedPost = formatPost(post);
        if (!formattedPost) return;

        formattedPost.channel = Object.keys(CHANNELS_INFO).find((channelName) => CHANNELS_INFO[channelName].subreddit === post.data.subreddit);

        createPost(formattedPost)
          .then((savedPost) => sendPostToModerationGroup(savedPost, savedPost.channel))
          .catch((error) => {
            console.log('Error on saving new post!');
            console.log(`Error message: ${error.message}`);
          });
      });
    });
  }, null, true);
};


module.exports = { registerFetchingNewPostsCronJob };

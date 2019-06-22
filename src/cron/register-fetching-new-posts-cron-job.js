const CronJob = require('cron').CronJob;
const axios = require('axios');
const { createPost, formatPost, sendPostToModerationGroup } = require('../lib');
const { getCurrentUTCDate, transformUnixTimestampIntoDate, getOffsetDate } = require('../utils');
const { CHANNELS_INFO } = require('../constants');


const fetchNewPosts = () => {
  return Promise.all(
    Object.keys(CHANNELS_INFO).map((channelName) => {
      const channelInfo = CHANNELS_INFO[channelName];
      const subreddit = channelInfo.subreddit;
      const subredditNewPostsUrl = `https://reddit.com/r/${subreddit}/new.json?limit=100`;

      return axios.get(subredditNewPostsUrl).catch((error) => {
        console.log(`Error on fetching new posts from subreddit ${subreddit}!`);
        console.log(`Error message: ${error.message}`);
      });
    }),
  );
};

const getPostsFromFetchResponses = (fetchResponses) => {
  const posts = [];

  fetchResponses.forEach((fetchResponse) => posts.push(...fetchResponse.data.data.children));

  return posts;
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

  new CronJob('*/30 * * * * *', async () => { // Every 30th second
    const fetchResponses = await fetchNewPosts();
    if (!fetchResponses) return;

    const posts = getPostsFromFetchResponses(fetchResponses);
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
  }, null, true);
};


module.exports = { registerFetchingNewPostsCronJob };

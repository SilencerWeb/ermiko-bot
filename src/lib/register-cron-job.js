const CronJob = require('cron').CronJob;
const axios = require('axios');
const { createPost, sendPostToModerationGroup } = require('./');
const { getCurrentUTCDate, transformUnixTimestampIntoDate, getOffsetDate } = require('../utils');
const { CHANNELS_INFO } = require('../constants');


const fetchNewPosts = () => {
  return Promise.all(
    Object.keys(CHANNELS_INFO).map((channelName) => {
      const channelInfo = CHANNELS_INFO[channelName];
      const subreddit = channelInfo.subreddit;
      const subredditNewPostsUrl = `https://reddit.com/r/${subreddit}/new.json`;

      return axios.get(subredditNewPostsUrl);
    }),
  ).catch((error) => {
    console.log(`Error on fetching new posts!`);
    console.log(`Error: ${error.message}`);
  });
};

const getPostsFromFetchResponses = (fetchResponses) => {
  const posts = [];

  fetchResponses.forEach((fetchResponse) => posts.push(...fetchResponse.data.data.children));

  return posts;
};

const getRecentPosts = (posts) => {
  return posts.filter((post) => {
    return transformUnixTimestampIntoDate(post.data.created_utc) >= getOffsetDate(getCurrentUTCDate(), 30000); // 30000 milliseconds = 30 seconds
  });
};


const registerCronJob = () => {

  new CronJob('*/30 * * * * *', async () => {
    const fetchResponses = await fetchNewPosts();

    if (!fetchResponses) return;

    const posts = getPostsFromFetchResponses(fetchResponses);
    const recentPosts = getRecentPosts(posts);

    recentPosts.forEach((post) => createPost(post).then((savedPost) => sendPostToModerationGroup(savedPost, savedPost.channel)));
  }, null, true);
};


module.exports = { registerCronJob };
